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

const storeChannel = 'C04ET84B9UH'

const showStore = async (slack, thread) => {
  const app = await bag.getApp()
  const identity = await bag.getIdentity({
    identityId: slack
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
    await bag.getInventory({ identityId: process.env.ME })
  ).filter(instance => Object.keys(canSell).includes(instance.itemId))
  if (inventory.length) {
    for (let instance of inventory) {
      const item = await bag.getItem({
        query: JSON.stringify({ name: instance.itemId })
      })
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `x1 ${item.reaction} ${instance.itemId} costs ${
            canSell[instance.itemId]
          } :-gp: each and there ${instance.quantity === 1 ? 'is' : 'are'} x${
            instance.quantity
          } currently`
        },
        accessory: {
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
      })
    }

    blocks.push({
      type: 'divider'
    })

    // Get items in cart
    if (!identity.metadata.jcStoreCart)
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Items in cart: nothing yet.'
        }
      })
    else {
      const cart = (
        await bag.getTrade({
          tradeId: identity.metadata.jcStoreCart
        })
      ).receiverTrades
      let cartToString = []
      for (let order of cart) {
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
                id: instance.id
              }
            })
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
        ...cartToString
      )
    }
  } else
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Nothing currently. Check back tomorrow for new fares!'
      }
    })

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

  await bag.updateIdentityMetadata({
    identityId: props.context.userId,
    metadata: JSON.stringify({ jcStoreCart: null })
  })

  const { channel, ts } = await props.client.chat.postMessage({
    channel: props.body.event.channel,
    blocks: await showStore(props.context.userId)
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
      text: "Credit applications coming soon so you can take out loans, but in the meantime, you can't spare that kind of :-gp: quite yet."
    })
  gp = gp[0]

  // Check cart
  const identity = await bag.getIdentity({
    identityId: slack
  })
  if (!identity.metadata.jcStoreCart) {
    // First item in cart
    let cart = await bag.createTrade({
      initiator: props.context.userId,
      receiver: process.env.ME
    })

    cart = await bag.updateTrade({
      tradeId: cart.id,
      identityId: props.context.userId,
      add: [{ id: gp.id, quantity: cost }]
    })

    cart = await bag.updateTrade({
      tradeId: cart.id,
      identityId: process.env.ME,
      add: [{ id: instance.id, quantity }]
    })

    await bag.updateIdentityMetadata({
      identityId: props.context.userId,
      metadata: JSON.stringify({ jcStoreCart: cart.id })
    })
  } else {
    // Add item to cart
    await bag.updateTrade({
      tradeId: identity.metadata.jcStoreCart,
      identityId: props.context.userId,
      add: [{ id: gp.id, quantity: cost }]
    })

    await bag.updateTrade({
      tradeId: identity.metadata.jcStoreCart,
      identityId: process.env.ME,
      add: [{ id: instance.id, quantity }]
    })
  }

  await props.client.chat.update({
    ...thread,
    blocks: await showStore(slack, thread)
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
