import { config } from 'dotenv'
config()

import { Client, Intents } from 'discord.js'

import commandHandler from './commands/command-handler'

import { onVoiceChannelEnter, onVoiceChannelExit } from './utils/songs-handler'

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES

    ]
})


bot.on('ready', (client) => {

    client.user.setActivity(process.env.DISCORD_CLIENT_ACTIVITY as string, { type: 'LISTENING' })

    console.log(`Logged in as: ${client.user.tag}`)

})

bot.on('messageCreate', commandHandler)
bot.on('voiceStateUpdate', (oldState, newState) => {

    const newUserChannel = newState.channel
    const oldUserChannel = oldState.channel
    
    if (oldUserChannel == null && newUserChannel != null) onVoiceChannelEnter(newState, bot)
    else if(newUserChannel == null) onVoiceChannelExit(oldState, bot)
    else { onVoiceChannelExit(newState, bot), onVoiceChannelEnter(oldState, bot) }

})

bot.login(process.env.DISCORD_CLIENT_TOKEN as string)