const { App: SlackApp } = require('@slack/bolt')
const { App: Bag } = require('@hackclub/bag')
require('dotenv/config')

const app = new SlackApp({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

let bag

const canSell = {
  'Fancy Pants': 30,
  'Cake': 50,
  'Ruby': 10
}

const storeChannel = 'C04ET84B9UH'

const showStore = async (slack, thread) => {
  const app = await bag.getApp()
  const identity = await bag.getIdentity({ identityId: slack })
  let cart = undefined
  if (identity.metadata.jcStoreCart && identity.metadata.jcStoreCart.id)
    cart = await bag.getTrade({
      tradeId: identity.metadata.jcStoreCart.id
    })

  let blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Hello <@${slack}>!\n\n>${app.description}\n\nHere's what's up for grabs right now:`
      }
    }
  ]

  // Get all items in my inventory that are in canSell
  const inventory = (
    await bag.getInventory({
      identityId: process.env.ME,
      available: true
    })
  ).filter(instance => Object.keys(canSell).includes(instance.itemId))
  if (!inventory.length) {
    if (!cart || !cart.receiverTrades.length) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Nothing currently. Check back tomorrow for new fares!'
        }
      })
      return blocks
    }
    // User has a cart with items, but nothing is in stock
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Nothing in stock currently.'
      }
    })
  } else {
    for (let instance of inventory) {
      const item = await bag.getItem({
        query: JSON.stringify({ name: instance.itemId })
      })
      let info = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `x1 ${item.reaction} ${instance.itemId} costs ${
            canSell[instance.itemId]
          } :-gp: each and there ${instance.quantity === 1 ? 'is' : 'are'} x${
            instance.quantity
          } currently`
        }
      }
      if (thread)
        info.accessory = {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Add to cart'
          },
          style: 'primary',
          value: JSON.stringify({
            instance: {
              name: item.name,
              id: instance.id,
              quantity: instance.quantity
            },
            thread,
            slack
          }),
          action_id: 'add-cart'
        }
      blocks.push(info)
    }
  }

  blocks.push({
    type: 'divider'
  })

  // Get items in cart
  if (!cart)
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Items in cart: nothing yet.'
      }
    })
  else {
    let cartToString = []
    for (let order of cart.receiverTrades) {
      const { instance } = order
      const item = await bag.getItem({
        query: JSON.stringify({ name: instance.itemId })
      })
      cartToString.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `x${order.quantity} ${item.reaction} ${item.name}`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Remove from cart'
          },
          style: 'danger',
          value: JSON.stringify({
            thread,
            slack,
            instance: {
              name: item.name,
              id: instance.id,
              quantity: order.quantity
            }
          }),
          action_id: 'remove-cart'
        }
      })
    }
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Items in cart:'
        }
      },
      ...cartToString,
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Total: ${cart.initiatorTrades[0].quantity} :-gp:`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Cancel'
            },
            value: JSON.stringify({ thread, slack }),
            style: 'danger',
            action_id: 'cancel-checkout'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Checkout'
            },
            value: JSON.stringify({ thread, slack }),
            style: 'primary',
            action_id: 'checkout'
          }
        ]
      }
    )
  }

  console.log('Blocks', blocks)

  return blocks
}

app.event('app_mention', async props => {
  // Check in channel
  // if (props.event.channel !== storeChannel)
  //   return await props.client.chat.postEphemeral({
  //     channel: props.event.channel,
  //     user: props.context.userId,
  //     text: `I don't see <@${props.context.botUserId}> anywhere around here... wait, are we holding the map upside down? It's in <#${storeChannel}>.`
  //   })

  const user = await bag.getIdentity({
    identityId: props.context.userId
  })

  if (user.metadata.jcStoreCart !== null) {
    try {
      // There's already a previous thread, delete that thread before creating a new one
      await props.client.chat.delete({
        ...user.metadata.jcStoreCart.thread
      })
    } catch {}
  }

  const { channel, ts } = await props.client.chat.postMessage({
    channel: props.body.event.channel,
    blocks: await showStore(props.context.userId)
  })

  await bag.updateIdentityMetadata({
    identityId: props.context.userId,
    metadata: JSON.stringify({
      jcStoreCart: { thread: { channel, ts } }
    })
  })

  console.log('Updating message')

  await props.client.chat.update({
    channel,
    ts,
    blocks: await showStore(props.context.userId, { channel, ts })
  })
})

app.action('remove-cart', async props => {
  await props.ack()
  const { instance, thread, slack } = JSON.parse(props.action.value)
  if (slack !== props.context.userId)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: 'Not your shopping cart, unfortunately.'
    })

  console.log(instance)

  const user = await bag.getIdentity({ identityId: slack })

  // Remove from cart
  const cart = await bag.updateTrade({
    tradeId: user.metadata.jcStoreCart.id,
    identityId: process.env.ME,
    remove: [{ id: instance.id, quantity: instance.quantity }]
  })

  // Update gp
  await bag.updateTrade({
    tradeId: user.metadata.jcStoreCart.id,
    identityId: props.context.userId,
    remove: [
      {
        id: cart.initiatorTrades[0].instanceId, // gp tradeInstance id
        quantity: canSell[instance.name] * instance.quantity
      }
    ]
  })

  return await props.client.chat.update({
    ...thread,
    blocks: await showStore(slack, thread)
  })
})

app.action('add-cart', async props => {
  await props.ack()
  const { instance, thread, slack } = JSON.parse(props.action.value)
  if (slack !== props.context.userId)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: 'Not your shopping cart, unfortunately.'
    })

  await props.client.views.open({
    trigger_id: props.body.trigger_id,
    view: {
      callback_id: 'add-cart',
      title: {
        type: 'plain_text',
        text: `Add ${instance.name} to cart`
      },
      submit: {
        type: 'plain_text',
        text: 'Add to cart'
      },
      type: 'modal',
      private_metadata: JSON.stringify({ instance, thread, slack }),
      blocks: [
        {
          type: 'input',
          element: {
            type: 'number_input',
            is_decimal_allowed: false,
            action_id: 'quantity',
            min_value: '1',
            max_value: instance.quantity.toString(),
            initial_value: '1'
          },
          label: {
            type: 'plain_text',
            text: 'Quantity'
          }
        }
      ]
    }
  })
})

app.view('add-cart', async props => {
  await props.ack()
  const { instance, thread, slack } = JSON.parse(props.view.private_metadata)

  const quantity = Number(
    Object.values(props.view.state.values)[0].quantity.value
  )

  // Check if user has enough gp
  const cost = canSell[instance.name] * quantity
  let gp = (
    await bag.getInventory({ identityId: props.context.userId })
  ).filter(instance => instance.itemId === 'gp')
  if (!gp.length || gp[0] < cost)
    return await props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: "Looks like you can't spare that kind of :-gp: yet."
    })
  gp = gp[0]

  // Check cart
  const identity = await bag.getIdentity({ identityId: slack })
  if (!identity.metadata.jcStoreCart.id) {
    // First item in cart
    let cart = await bag.createTrade({
      initiator: props.context.userId, // User is the one initiating it
      receiver: process.env.ME
    })

    await bag.updateTrade({
      tradeId: cart.id,
      identityId: props.context.userId,
      add: [{ id: gp.id, quantity: cost }]
    })

    await bag.updateTrade({
      tradeId: cart.id,
      identityId: process.env.ME,
      add: [{ id: instance.id, quantity }]
    })

    await bag.updateIdentityMetadata({
      identityId: props.context.userId,
      metadata: JSON.stringify({
        jcStoreCart: {
          ...identity.metadata.jcStoreCart,
          id: cart.id
        }
      })
    })
  } else {
    // Add item to cart
    await bag.updateTrade({
      tradeId: identity.metadata.jcStoreCart.id,
      identityId: props.context.userId,
      add: [{ id: gp.id, quantity: cost }]
    })

    await bag.updateTrade({
      tradeId: identity.metadata.jcStoreCart.id,
      identityId: process.env.ME,
      add: [{ id: instance.id, quantity }]
    })
  }

  await props.client.chat.update({
    ...thread,
    blocks: await showStore(slack, thread)
  })
})

app.action('cancel-checkout', async props => {
  await props.ack()
  const { thread, slack } = JSON.parse(props.action.value)
  if (slack !== props.context.userId)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: 'Not your shopping cart, unfortunately.'
    })
  const user = await bag.getIdentity({ identityId: slack })

  await bag.closeTrade({
    tradeId: user.metadata.jcStoreCart.id,
    cancel: true
  })

  await bag.updateIdentityMetadata({
    identityId: slack,
    metadata: JSON.stringify({ jcStoreCart: null })
  })

  await props.client.chat.delete({
    ...thread
  })

  await props.client.chat.postEphemeral({
    channel: thread.channel,
    user: props.context.userId,
    text: 'Aww. Come by next time?'
  })
})

app.action('checkout', async props => {
  await props.ack()
  const { thread, slack } = JSON.parse(props.action.value)
  if (slack !== props.context.userId)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: 'Not your shopping cart, unfortunately.'
    })

  const user = await bag.getIdentity({ identityId: slack })

  const sale = await bag.closeTrade({
    tradeId: user.metadata.jcStoreCart.id
  })

  await bag.updateIdentityMetadata({
    identityId: slack,
    metadata: JSON.stringify({ jcStoreCart: { id: null } })
  })

  let purchased = []
  for (let purchase of sale.receiverTrades) {
    const instance = await bag.getInstance({
      instanceId: purchase.instanceId
    })
    purchased.push(
      `x${purchase.quantity} ${instance.item.reaction} ${instance.item.name}`
    )
  }

  await props.client.chat.update({
    ...thread,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Thanks <@${slack}> for stopping by! Here's what you got:\n\n${purchased.join(
            '\n'
          )}`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Total: ${sale.initiatorTrades[0].quantity} :-gp:`
        }
      }
    ]
  })
})

// @prettier-ignore
;(async () => {
  bag = await Bag.connect({
    appId: Number(process.env.BAG_APP_ID),
    key: process.env.BAG_APP_KEY,
    baseUrl: 'https://c70f-71-235-174-134.ngrok-free.app'
  })

  const port = process.env.PORT || 3002
  await app.start(port)
  console.log(`⚡️ Bolt app is running on port ${port}!`)
})()
