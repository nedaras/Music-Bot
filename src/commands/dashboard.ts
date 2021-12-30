import { joinVoiceChannel,VoiceConnection } from '@discordjs/voice'
import type { Message } from 'discord.js'
import { getCurrentSong, playSong } from '../utils/songs'

export default function (_: string[], message: Message) {

    const channel = message.member?.voice.channel

    if (channel && message.guild) {

        try {

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
                
            })
            
            play(connection)

        } catch(error) { console.log(error) }

    }

    message.guild && message.channel.send(`http://localhost:3000/dashboard/${message.guild.id}`)

}

async function play(connection: VoiceConnection) {

    const song = await getCurrentSong()

    if (connection.state.status !== 'disconnected' && song) {

        playSong(connection, song.url, async (error) => {

            await song.delete()
            !error && play(connection)

            error && console.log(error)

        })

    }

}