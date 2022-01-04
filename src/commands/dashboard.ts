import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import type { Message } from 'discord.js'
import { onCurrentSongRemoved, onSongsUpdate, playSong } from '../utils/songs'

export default async function (_: string[], message: Message) {

    const channel = message.member?.voice.channel

    if (channel && message.guild) {

        try {

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator

            })

            play(connection)

        } catch (error) { console.log(error) }

    }

    message.guild && message.channel.send(`http://localhost:3000/dashboard/${message.guild.id}`)

}


async function play(connection: VoiceConnection) {

    const song = await onSongsUpdate()

    if (connection.state.status !== 'disconnected') {

        const player = playSong(connection, song.url, async (error) => {

            console.log('fineshed!')
            
            await song.delete()
            !error && play(connection)

            error && console.log(error)

        })

        onCurrentSongRemoved(() => player.stop())

    }

}