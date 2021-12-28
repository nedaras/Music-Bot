import { Client, Intents } from 'discord.js'
import { token, activity } from '../bot.json'

import commandHandler from './commands/commandHandler'

const bot = new Client({ intents: [ 
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES

] })

bot.on('ready', (client) => {

    client.user.setActivity(activity, { type: 'LISTENING' })

    console.log(`Logged in as: ${client.user.tag}`)

})

bot.on('messageCreate', commandHandler)

bot.login(token)