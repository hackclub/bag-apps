import { App } from '@hackclub/bag'
import 'dotenv/config'

async function main() {
  const app = await App.connect({
    appId: Number(process.env.APP_ID),
    key: process.env.APP_TOKEN,
    baseUrl: 'http://0.0.0.0:3000'
  })

  console.log(
    await app.createInstance({
      identityId: 'U03MNFDRSGJ',
      itemId: 'Iron',
      quantity: 2
    })
  )
}

main()
