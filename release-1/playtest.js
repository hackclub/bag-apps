import fs from "fs";
import { google } from "googleapis";
import express from "express";
import open from "open";
import path from "path";
import csv from "fast-csv";
import { fileURLToPath } from "url";
import { App } from "@hackclub/bag";
import "dotenv/config";
import cron from "node-cron";

let day = 1;

async function setup() {
    // Initial setup
    const keyfile = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "credentials.json"
    );
    const keys = JSON.parse(fs.readFileSync(keyfile));
    const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

    const client = new google.auth.OAuth2(
        keys.web.client_id,
        keys.web.client_secret,
        keys.web.redirect_uris[0]
    );

    const authorizeUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: scopes
    });

    const app = express();
    app.get("/oauth2callback", (req, res) => {
        const code = req.query.code;
        client.getToken(code, (err, tokens) => {
            if (err) {
                console.error("Error getting oAuth tokens:");
                throw err;
            }
            client.credentials = tokens;
            res.send(
                "Authentication successful! Please return to the console."
            );
            server.close();
            sheetToItems(client);
        });
    });

    const server = app.listen(5000, () => {
        open(authorizeUrl, { wait: false });
    });

    async function sheetToItems(auth) {
        const sheets = google.sheets("v4");
        const app = await App.connect({
            appId: Number(process.env.APP_ID),
            key: process.env.APP_TOKEN,
            baseUrl: "https://bag-client.hackclub.com"
        });
        sheets.spreadsheets.values.get(
            {
                auth,
                spreadsheetId: "1Pffach_eQrW3FOTEF6CqIksVY1IKSE8s_oRkeQZ8V5k",
                range: "A2:K"
            },
            async (err, res) => {
                if (err) {
                    console.error("The API returned an error.");
                    throw err;
                }
                const rows = res.data.values;
                for (let row of rows) {
                    if (row.length >= 8) {
                        const sprite = row[9];
                        if (sprite) continue;
                        const name = row[3];
                        const description = row[6];
                        const reaction = row[5];
                        const drawer = row[1];
                        const rarity = row[8];
                        try {
                            const item = await app.createItem({
                                item: {
                                    name,
                                    description: `${description} - Drawn by ${drawer}`,
                                    reaction: `:${reaction}:`,
                                    metadata: JSON.stringify({
                                        rarity: Number(rarity)
                                    })
                                }
                            });
                            console.log("Item created: ", item);
                        } catch {
                            console.log("Problem creating item");
                        }
                    }
                }
            }
        );
    }
}

async function parse() {
    return new Promise((resolve, reject) => {
        let slackers = [];

        fs.createReadStream(path.resolve(process.cwd(), "analytics.csv"))
            .pipe(csv.parse({ headers: true }))
            .on("error", error => reject(error))
            .on("data", row => {
                if (row["Messages posted"] !== "0")
                    slackers.push({
                        id: row["User ID"],
                        messages: Number(row["Messages posted"])
                    });
            })
            .on("end", rowCount => {
                slackers = slackers.sort((a, b) => {
                    if (a.messages > b.messages) return -1;
                    return 1;
                });
                return resolve(slackers);
            });
    });
}

// setup();

async function main() {
    parse().then(async slackers => {
        const testers = {
            jc: "U03MNFDRSGJ"
            // chris: "UDK5M9Y13",
            // kara: "U032A2PMSE9",
            // max: "U0C7B14Q3"
        };

        const app = await App.connect({
            appId: Number(process.env.APP_ID),
            key: process.env.APP_TOKEN,
            baseUrl: "https://bag-client.hackclub.com"
        });

        // Get all items
        const items = (
            await app.readItem({
                query: JSON.stringify({})
            })
        ).items;

        // Let's go through ever Hack Clubber that has posted at least one message in the last week and give them some items based on a probability distribution!
        for (let [key, id] of Object.entries(testers)) {
            let instances = [];
            for (let item of items.sort((a, b) =>
                Math.random() < 0.5 ? 1 : -1
            )) {
                const prob = Math.random();
                if (prob < item.metadata.rarity) {
                    // Give it to them!
                    instances.push({
                        itemId: item.name,
                        identityId: id,
                        quantity: Math.max(
                            1,
                            Math.floor(
                                Math.random() * item.metadata.rarity * 10
                            )
                        )
                    });
                    if (instances.length === 3) break;
                }
            }
            await app.createInstances({
                instances,
                identityId: id,
                note: "An mysterious old man comes by your home with a jaunty stroll, whistling as he goes. He throws a bag at your door, which bounces off and lands on your doorstep. You pick the bag up, feeling three objects inside. Some instructions are printed on the outside: *This is your bag. Use `/inventory` to see what it holds.*"
            });
        }
    });

    // Currently every minute... set to every day
    const task = cron.schedule("* * * * *", async () => {
        const app = await App.connect({
            appId: Number(process.env.APP_ID),
            key: process.env.APP_TOKEN,
            baseUrl: "https://bag-client.hackclub.com"
        });

        for (let [key, id] of Object.entries(testers)) {
            for (let item of items.sort((a, b) =>
                Math.random() < 0.5 ? 1 : -1
            )) {
                const prob = Math.random();
                if (prob < item.metadata.rarity) {
                    let note;
                    switch (day) {
                        case 2:
                            note = `The old man appears again, kicking up dust as he shuffles down the road. He carefully places ${item.reaction} on your doorstep. You are suddently overcome with the urge to type \`/item get ${item.name}\` to learn about this curious object.`;
                            break;
                        case 3:
                            note = `This time the old man is tap-dancing. He executes a perfect one-armed handstand on your doorstep, and ${item.reaction} falls out of his pocket. What a strange person. He moonwalks away, screaming at the top of his hungs: "You can trade! Use the \`/trade\` command! This is a very important skill!!!"`;
                            break;
                        case 4:
                            note = `The mysterious figure appears on the horizon once again, groaning and holding his back. He lies down in front of your door, sobbing, clutching ${item.reaction} in his gnarled hands. He leaves it behind, wailing, "I just want people to use the four sacred commands... \`/inventory\`, \`/item\`, \`/trade\`, \`/give\`... why can't people just understand that?" Your pity for the man compels you to try these strange commands for yourself.`;
                    }

                    await app.createInstance({
                        itemId: item.name,
                        identityId: id,
                        quantity: Math.max(
                            1,
                            Math.floor(
                                Math.random() * item.metadata.rarity * 10
                            )
                        ),
                        note
                    });
                }
            }
        }

        day++;
        if (day == 4) task.stop(); // Stop distributing items!
    });
}

main();
