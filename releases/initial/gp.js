import { App } from '@hackclub/bag'
import csv from 'fast-csv'
import fs from 'fs'
import path from 'path'

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
  const app = await App.connect({
    appId: process.env.APP_ID,
    key: process.env.APP_TOKEN
  })

  parse().then(async slackers => {
    const random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min)
    let note =
      "You look longingly out the window. You haven't seen your mysterious friend for some time now. You stand on your doorstep, thinking how you miss that funny old chap... life feels strangely empty without his antics. But what's that? A tuft of white hair peeks over the horizon. You see a silhouetted figure begin to rotate, spinning faster and faster, before releasing something with the perfect form of an Olympic-level hammer throw. Time stands still as you fixate on the object sailing toward you. The arc it makes through the atmosphere is beautiful. Poetic. Like a rainbow. And then, it hits you. Literally, you get beaned in the head by a rather heavy bag. Good thing you were wearing your favorite 1951 standard-issue US Army Korean War helmet. WWII surplus, to get into the mood for watching a little MASH this morning. You pick the bag up, feeling that it's full of gp, and look up to see the old man is gone once again. But you hear a cry from over the hill: *I almost forgot, a little pocket money to stimulate the economyyyyyyyy!*"
    for (let slacker of slackers) {
      const { id } = slacker
      const coins = random(20, 40)
      console.log(
        await app.createInstance({
          itemId: 'gp',
          identityId: id,
          quantity: coins,
          note
        })
      )
    }
  })
}

main()
