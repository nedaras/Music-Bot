import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import { Client, VoiceState } from 'discord.js'
import { onDocumentRemoved, onSongsUpdate, playSong } from './songs'

let connection: VoiceConnection | null = null
let channelId: string | null = null

export function onVoiceChannelEnter(newState: VoiceState, bot: Client) {

    if (newState.member?.id === process.env.DISCORD_CLIENT_ID && connection && channelId) return

    songsHandler(bot, newState.guild.id)

}

export function onVoiceChannelExit(oldState: VoiceState, bot: Client) {

    if (oldState.member?.id === process.env.DISCORD_CLIENT_ID) {

        connection = null
        channelId = null

        return

    }

}

async function songsHandler (bot: Client, guild: string) {

    const song = await onSongsUpdate()

    const { id, voiceAdapterCreator, members } = await bot.guilds.fetch(guild)
    const { voice } = await members.fetch(song.creatorId)
    
    if (!connection || voice.channelId !== channelId) {

        connection = joinVoiceChannel({
            channelId: voice.channelId as string,
            guildId: id,
            adapterCreator: voiceAdapterCreator
            
        })

        channelId = voice.channelId

    }

    const player = playSong(connection, song.url, async (error) => {

        await song.delete()
        !error && songsHandler(bot, guild)

        error && console.log(error)

    })

    onDocumentRemoved(song.id).then(() => player.stop())

}