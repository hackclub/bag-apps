import fs from 'fs'
import path from 'path'
import csv from 'fast-csv'
import { App } from '@hackclub/bag'

async function parse() {
  return new Promise((resolve, reject) => {
    let slackers = []

    fs.createReadStream(path.resolve(process.cwd(), 'analytics.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', row => {
        if (row['Messages posted'] !== '0')
          slackers.push({
            id: row['User ID'],
            messages: Number(row['Messages posted'])
          })
      })
      .on('end', rowCount => {
        slackers = slackers.sort((a, b) => {
          if (a.messages > b.messages) return -1
          return 1
        })
        return resolve(slackers)
      })
  })
}

async function main() {
  parse().then(async slackers => {
    const app = await App.connect({
      appId: Number(process.env.APP_ID),
      key: process.env.APP_TOKEN
    })

    let channels = {
      'Fishing Rod': 'C06KJCY58GY',
      'Pickaxe': 'C06KJDF425N',
      'Axe': 'C06JF3MERUP',
      'Shears': 'C06K8TDSFS5',
      'Ladder': 'C06K8TDSFS5',
      'Trowel': 'C06K8TDSFS5',
      'Bread': 'C06K8TDSFS5',
      'Shovel': 'C06KJCY58GY',
      'Scythe': 'C06K8TDSFS5'
    }
    let items = []
    for (let item of Object.keys(channels)) {
      items.push(
        (
          await app.readItems({
            query: JSON.stringify({ name: item })
          })
        ).items[0]
      )
    }

    for (let slacker of slackers) {
      const { id } = slacker
      let item = items.sort(() => (Math.random() < 0.5 ? 1 : -1))[0]
      let note = `It's been weeks since you saw MOM. Not like, your mother. She visited yesterday. The MOM in question is the Mysterious Old Man. Your mind still occasionally drifts to your eccentric friend, if you could even call him that. But mostly, at this point, you've moved on.\n\n...and then you hear him. Or rather, you hear a bagpipe. Accompanied by the unmistakable sound of a WWII surplus M4A3E8 Sherman tank trundling down the road. And there's only one person who would do a thing like that.\n\nYour suspicions are confirmed when you pull the curtain back and witness the amusing sight of the old man attempting to untangle his beard from the drone pipes without stopping either the music or the tank. He pulls up in front of your house, cuts the engine, stashes his bagpipe and hops out. You greet him at the door, and before you can say anything he shouts:\n\nYOU! You there! I've come to _bring_ you something: this lovely ${
        item.reaction
      } ${item.name}! I highly recommend you go to <#${
        channels[item.name]
      }> and run \`/use ${
        item.name
      }\`. You may be _surprised_ and _delighted_ by the rewards!!\n\nThis man has _terrible_ breath. You open your mouth to respond, but he's already running back to his massive vehicle. The music starts back up and all you can do is watch him slowly advance to the next house down the road.\n\nActually, that's _not_ all you can do. You could also go to <#${
        channels[item.name]
      }> right now and run \`/use ${item.name}\`.`
      console.log(
        await app.createInstance({
          itemId: item.name,
          identityId: id,
          quantity: 1,
          note
        })
      )
    }
  })
}

main()
