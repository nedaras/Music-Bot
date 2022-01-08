import { config } from 'dotenv'
config()

import { Client, Intents } from 'discord.js'

import commandHandler from './commands/command-handler'

import songsHandler from './utils/songs-handler'

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES

    ]
})


bot.on('ready', (client) => {

    client.user.setActivity(process.env.DISCORD_CLIENT_ACTIVITY as string, { type: 'LISTENING' })

    songsHandler(client)

    console.log(`Logged in as: ${client.user.tag}`)

})

bot.on('messageCreate', commandHandler)

bot.login(process.env.DISCORD_CLIENT_TOKEN as string)