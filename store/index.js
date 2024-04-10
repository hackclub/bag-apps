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
  'Cake': 50
}

const showStore = async (slack, thread) => {
  const app = await bag.getApp()
  let cart = undefined
  if (app.metadata[slack] && app.metadata[slack].id)
    cart = await bag.getTrade({
      tradeId: app.metadata[slack].id
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

  return blocks
}

app.event('app_mention', async props => {
  const app = await bag.getApp()

  if (app.metadata[props.context.userId] !== null) {
    try {
      // There's already a previous thread, delete that thread before creating a new one
      await props.client.chat.delete({
        ...app.metadata[props.context.userId].thread
      })
    } catch {}
  }

  const { channel, ts } = await props.client.chat.postMessage({
    channel: props.body.event.channel,
    blocks: await showStore(props.context.userId)
  })

  // Add channel and thread to our metadata
  await bag.updateApp({
    new: {
      metadata: JSON.stringify({
        [props.context.userId]: {
          thread: { channel, ts }
        }
      })
    }
  })

  await props.client.chat.update({
    channel,
    ts,
    blocks: await showStore(props.context.userId, { channel, ts })
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
            initial_value: '1',
            max_value: instance.quantity.toString()
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
  const app = await bag.getApp()
  if (!app.metadata[props.context.userId].id) {
    // First item in cart
    const cart = await bag.createTrade({
      initiator: props.context.userId,
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

    await bag.updateApp({
      new: {
        metadata: JSON.stringify({
          [props.context.userId]: {
            ...app.metadata[props.context.userId],
            id: cart.id
          }
        })
      }
    })
  } else {
    // Add item to cart
    await bag.updateTrade({
      tradeId: app.metadata[props.context.userId].id,
      identityId: props.context.userId,
      add: [{ id: gp.id, quantity: cost }]
    })

    await bag.updateTrade({
      tradeId: app.metadata[props.context.userId].id,
      identityId: process.env.ME,
      add: [{ id: instance.id, quantity }]
    })
  }

  await props.client.chat.update({
    ...thread,
    blocks: await showStore(slack, thread)
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

  const app = await bag.getApp()

  // Check if user has enough gp
  const cart = await bag.getTrade({
    tradeId: app.metadata[props.context.userId].id
  })
  const gp = cart.initiatorTrades[0].quantity
  const cost = cart.receiverTrades.reduce(
    (acc, curr) => acc + canSell[curr.instance.itemId] * curr.quantity,
    0
  )
  if (gp < cost)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: "Looks like you can't spare that kind of :-gp: yet... try taking a few items off."
    })

  let purchased = []
  for (let purchase of cart.receiverTrades) {
    const item = await bag.getItem({
      query: JSON.stringify({ name: purchase.instance.itemId })
    })
    purchased.push(`x${purchase.quantity} ${item.reaction} ${item.name}`)
  }

  const sale = await bag.closeTrade({
    tradeId: app.metadata[props.context.userId].id
  })

  await bag.updateApp({
    new: JSON.stringify({
      [props.context.userId]: null
    })
  })

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

app.action('cancel-checkout', async props => {
  await props.ack()
  const { thread, slack } = JSON.parse(props.action.value)
  const app = await bag.getApp()

  await bag.closeTrade({
    tradeId: app.metadata[props.context.userId].id,
    cancel: true
  })

  await bag.updateApp({
    new: JSON.stringify({
      [props.context.userId]: null
    })
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

app.action('remove-cart', async props => {
  await props.ack()
  const { instance, thread, slack } = JSON.parse(props.action.value)
  if (slack !== props.context.userId)
    return props.respond({
      response_type: 'ephemeral',
      replace_original: false,
      text: 'Not your shopping cart, unfortunately.'
    })

  // Remove from cart
  const cart = await bag.updateTrade({
    tradeId: app.metadata[props.context.userId].id,
    identityId: process.env.ME,
    remove: [{ id: instance.id, quantity: instance.quantity }]
  })

  // Update gp
  await bag.updateTrade({
    tradeId: app.metadata[props.context.userId].id,
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

// @prettier-ignore
;(async () => {
  bag = await Bag.connect({
    appId: Number(process.env.BAG_APP_ID),
    key: process.env.BAG_APP_KEY
  })

  const port = process.env.PORT || 3002
  await app.start(port)
  console.log(`⚡️ Bolt app is running on port ${port}!`)
})()
