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
  Iron: 10,
  Ruby: 30,
  Emerald: 30,
  Glass: 25
}

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

  const inventory = (
    await bag.getInventory({
      identityId: process.env.ME,
      available: true
    })
  ).filter(instance => Object.keys(canSell).includes(instance.itemId))
  if (!inventory.length) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Nothing currently. Check back tomorrow for new fares!'
      }
    })
    return blocks
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

  return blocks
}

app.event('app_mention', async props => {
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

// @prettier-ignore
;(async () => {
  bag = await Bag.connect({
    appId: Number(process.env.BAG_APP_ID),
    key: process.env.BAG_APP_KEY,
    baseUrl: 'https://8f34-71-235-174-134.ngrok-free.app'
  })

  const port = process.env.PORT || 3002
  await app.start(port)
  console.log(`⚡️ Bolt app is running on port ${port}!`)
})()
