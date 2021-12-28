import { joinVoiceChannel,VoiceConnection } from '@discordjs/voice'
import type { Message } from 'discord.js'
import { playSong } from '../songs/play'

import Queue from '../utils/Queue'
import { documentCreated, deleteDocument } from '../utils/firebase' 

// index 0 is url ant index 1 os the documents id
const songs = new Queue<[ string, string ]>()

documentCreated((videoId, id) => { songs.push([ videoId, id ]) })

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

        } catch(error) {

            console.log(error)
            

        }

    }

    message.guild && message.channel.send(`http://localhost:3000/dashboard/${message.guild.id}`)

}

function play(connection: VoiceConnection, error?: unknown) {
    
    if (connection.state.status !== 'disconnected' && !songs.isEmpty()) {

        if (error) {

            console.log(error)    
            return
    
        }
        
        const [ videoId, id ] = songs.getLast()

        // eslint-disable-next-line no-shadow
        playSong(connection, `https://www.youtube.com/watch?v=${videoId}`, (error) => {

            // it works i just dont want to delete data for now
            deleteDocument(id)
            songs.pop()

            play(connection, error)

        })

    }

}