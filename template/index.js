import { App } from '@hackclub/bag'
import 'dotenv/config'

async function main() {
  const app = await App.connect({
    appId: Number(process.env.APP_ID),
    key: process.env.APP_TOKEN
  })

  console.log(app)
}

main()
