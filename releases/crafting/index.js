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

    const recipes = (await app.readRecipes({ query: {} })).recipes
    const possible = recipes.reduce((acc, curr) => {
      acc.push(...curr.inputs)
      return acc
    }, [])

    for (let slacker of slackers) {
      try {
        const { id } = slacker
        let { inventory } = await app.readInventory({ identityId: id })

        // Search for a recipe including the choice
        let choice, recipe
        while (inventory.length) {
          const index = Math.floor(Math.random() * inventory.length)
          choice = inventory[index]
          let results = await app.readRecipes({
            query: {
              inputs: [
                {
                  ...choice,
                  recipeItemId: choice.itemId
                }
              ]
            },
            inclusive: true
          })
          results.recipes = results.recipes.filter(r => {
            // Extra filter: inputs only
            if (r.inputs.find(input => input.recipeItemId === choice.itemId))
              return true
            return false
          })
          recipe = results.recipe[0]
          console.log(choice, recipe)
          if (!recipe) inventory.splice(index, 1)
          else break
        }
        if (!recipe) {
          // Nothing in inventory can be used, simply give them a random recipe
          recipe = recipes[Math.floor(Math.random() * recipes.length)]
          console.log('Random recipe', recipe)
        }

        let outputs = []
        for (let output of recipe.outputs) {
          let item = await app.readItems({
            query: JSON.stringify({
              name: output.recipeItemId
            })
          })
          outputs.push(`${item.items[0].reaction} ${item.items[0].name}`)
        }

        // Give user inputs and tools
        let give = []
        let giveFormatted = []
        for (let input of recipe.inputs) {
          give.push({
            itemId: input.recipeItemId,
            quantity: 1
          })
          const item = await app.readItems({
            query: JSON.stringify({
              name: input.recipeItemId
            })
          })
          giveFormatted.push(`${item.items[0].reaction} ${item.items[0].name}`)
        }
        for (let tool of recipe.tools) {
          give.push({
            itemId: tool.recipeItemId,
            quantity: 1
          })
          const item = await app.readItems({
            query: JSON.stringify({
              name: tool.recipeItemId
            })
          })
          giveFormatted.push(`${item.items[0].reaction} ${item.items[0].name}`)
        }

        // Give two extraneous items
        for (let i = 0; i < 2; i++) {
          let choice = possible[Math.floor(Math.random() * possible.length)]
          give.push({
            itemId: choice.recipeItemId,
            quantity: 1
          })
          const item = await app.readItems({
            query: JSON.stringify({
              name: choice.recipeItemId
            })
          })
          giveFormatted.push(`${item.items[0].reaction} ${item.items[0].name}`)
        }

        give = give.sort((a, b) => 0.5 - Math.random())
        let note = `It's morning. You can tell because there are morning sounds. You yawn as you raise your eye mask, but instead of fresh air and sunlight your mouth and eyeballs are suddenly filled with beard. "Wake up sleepyhead!" says the Mysterious Old Man, his nose literally an inch from your forehead.\n\nYou're too surprise to be disgusted by the sensation of grimy white hair all up in your face holes. The old man withdraws and takes a seat at the foot of the bed and starts rummaging in a leather fanny pack strapped to his waist. He is uncharacteristically calm and it's freaking you out.\n\nYou pull a long scraggly beard hair out of your mouth, watching as he carefully places random crap all over your freshly-laundered sheets. "Today is the day you learn to craft. I took a look in your bag, and I am leaving you with everything you need to craft ${outputs.join(
          ', '
        )}, plus a few extraneous goodies. Figuring out the exact combination of ingredients required is a fun little exercise left to the reader. Use \`/craft\` to get started. Goodbye.\n\nYou stare blankly as he walks backward out of your bedroom without ever breaking eye contact. Your front door creaks shut and your eyes fall to the stuff on your bed.\n\nSo then, some subset of ${giveFormatted.join(
          ', '
        )}, maybe also stuff in your bag, can be combined to make ${outputs.join(
          ', '
        )}. You might as well run \`/craft\` and get started then.`
        console.log(
          await app.createInstances({
            instances: give,
            identityId: id,
            show: true,
            note
          })
        )
      } catch {
        continue
      }
    }
  })
}

main()
