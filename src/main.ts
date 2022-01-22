import { config } from 'dotenv'
config()

import { Client, Intents } from 'discord.js'

import commandHandler from './commands/command-handler'

import songsHandler from './utils/songs-handler'
import express, { urlencoded } from 'express'
import voice from './api/user'
import guild from './api/guild'

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES

    ]
})

bot.on('messageCreate', commandHandler)

bot.login(process.env.DISCORD_CLIENT_TOKEN as string)

bot.on('ready', (client) => {

    client.user.setActivity(process.env.DISCORD_CLIENT_ACTIVITY as string, { type: 'LISTENING' })
    
    songsHandler(client)

    const app = express()

    app.use(express.json())
    app.use(urlencoded({ extended: false }))
    app.post('/api/user', (request, response) => voice(client, request, response))
    app.post('/api/guild', (request, response) => guild(client, request, response))

    app.listen(4000, () => console.log('rest api running on http://localhost:4000'))

    console.log(`Logged in as: ${client.user.tag}`)

})