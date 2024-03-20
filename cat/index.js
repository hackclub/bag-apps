const { App: SlackApp } = require('@slack/bolt')
const { App: Bag } = require('@hackclub/bag')
require('dotenv/config')

const app = new SlackApp({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

let bag

const getLeaderboard = async () => {
  // Grab leaderboard
  const identities = (
    await bag.getIdentities({
      query: JSON.stringify({})
    })
  )
    .filter(({ metadata }) => {
      if (Object.keys(metadata).includes('zucchiniFood')) return true
      return false
    })
    .sort((a, b) => {
      // Sort by most food given
      if (a.metadata.zucchiniFood > b.metadata.zucchiniFood) return 1
      return -1
    })
    .slice(0, 10)

  // Format into table
  return identities.map(
    (identity, i) =>
      `${i + 1}. <@${identity.slack}> gave her ${
        identity.metadata.zucchiniFood
      } :-fish:`
  )
}

app.command('/fatten', async props => {
  props.ack()

  // First, check and make sure it's #the-litter-box
  const channel = props.body.channel_id
  if (channel !== 'C039E59328Y')
    return await props.respond({
      response_type: 'ephemeral',
      text: "I don't see any cat..."
    })

  const inventory = await bag.getInventory({
    identityId: props.context.userId
  })
  let instances = []

  // First, check if it's something the fish can eat
  const canEat = [['fish', ':-fish:']]
  const message = props.command.text.trim().toLowerCase().split(' ')
  for (let food of message) {
    const find = canEat.find(eat => eat.find(item => item === food))
    if (!find) continue
    const index = instances.findIndex(
      instance => instance.itemId.toLowerCase() === find[0]
    )

    let quantity = 0
    if (index >= 0) {
      quantity = instances[index].quantity + 1
      instances[index].quantity = quantity
    } else {
      let instance = inventory.find(
        instance => instance.itemId.toLowerCase() === find[0]
      )
      instances.push({
        ...instance,
        quantity: 1
      })
    }
  }

  if (!instances.length) {
    // Here you can do something with a leaderboard. Like give negative points
    return await props.respond({
      response_type: 'ephemeral',
      text: "Zucchini hisses at you then walks away. Gosh, I hope she doesn't bite you one of these days for being so mean..."
    })
  }

  // Eat it by opening a trade
  let trade = await bag.createTrade({
    initiator: props.context.userId,
    receiver: props.context.botUserId
  })

  // Add some stuff to the trade
  try {
    trade = await bag.updateTrade({
      tradeId: trade.id,
      identityId: props.context.userId,
      add: instances
    })

    // Update leaderboard with the number of fishies Zucchini got
    await bag.updateIdentityMetadata({
      identityId: props.context.userId,
      metadata: JSON.stringify({
        zucchiniFood:
          instances.reduce((acc, curr) => acc + curr.quantity, 0) +
          ((
            await bag.getIdentity({ identityId: props.context.userId })
          ).metadata.zucchiniFood || 0)
      })
    })
  } catch (error) {
    return await props.respond({
      response_type: 'ephemeral',
      text: "Zucchini hisses at you then walks away. Gosh, I hope she doesn't bite your fingers off one of these days for being so mean and lying to her about having more fish than you really have..."
    })
  }

  // Now regurgitate something. Or maybe not?
  const canGive = {
    Diamond: 0.1,
    Emerald: 0.15,
    Gold: 0.12,
    Hairball: 0.5,
    Sapphire: 0.15,
    Tanzanite: 0.05,
    Ruby: 0.15
  }

  // Give to the user meow meow
  if (Math.random() < 0.2) {
    await props.respond({
      response_type: 'ephemeral',
      text: 'Zucchini gobbles up the fish you give her, then looks at you. No more fish? She walks away. Maybe you should try giving more fish next time.'
    })
  } else {
    await props.respond({
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Zucchini gobbles up the fish you give her, then looks at you. She purrs, and then gurgles, and then throws something up at your feet. Ew.'
          }
        }
      ]
    })

    let choice
    let total = Object.values(canGive).reduce((acc, curr) => acc + curr, 0)
    const random = Math.floor(Math.random() * total)
    for (let [key, value] of Object.entries(canGive).sort(
      (a, b) => Math.random() < 0.5
    )) {
      total -= value
      if (random >= total) {
        choice = key
        break
      }
    }

    const item = await bag.getItem({
      query: JSON.stringify({ name: choice })
    })

    const instance = await bag.createInstance({
      itemId: item.name,
      identityId: props.context.botUserId,
      quantity: 1,
      public: true,
      show: false
    })

    console.log(instance)

    // Add to trade
    trade = await bag.updateTrade({
      tradeId: trade.id,
      identityId: props.context.botUserId,
      add: [{ id: instance.id, quantity: 1 }]
    })

    if (choice === 'Hairball') {
      await props.respond({
        response_type: 'ephemeral',
        text: `Sigh. It's just a ${item.reaction} ${item.name}.`
      })
    } else {
      await props.respond({
        response_type: 'ephemeral',
        text: `Holy smokes. Why is something shiny in the gunk? You stoop down to take a closer look. Why does she have a ${item.reaction} ${item.name} in her... tummy? Whatever. You gingerly lift it up and pocket it, petting her for good measure.`
      })
    }
  }

  // Close trade so items can be transferred
  trade = await bag.closeTrade({ tradeId: trade.id })

  const leaderboard = await getLeaderboard()
  await props.respond({
    response_type: 'ephemeral',
    text: `Zucchini also wants you to know she appreciates these people the most:\n${leaderboard.join(
      '\n'
    )}`
  })
})

// @prettier-ignore
;(async () => {
  bag = await Bag.connect({
    appId: Number(process.env.BAG_APP_ID),
    key: process.env.BAG_APP_KEY,
    baseUrl: 'http://0.0.0.0:3000'
  })

  const port = process.env.PORT || 3002
  await app.start(port)
  console.log(`⚡️ Bolt app is running on port ${port}!`)
})()
