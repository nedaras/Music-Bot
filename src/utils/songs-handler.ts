import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import { Client } from 'discord.js'
import { firestore } from './firebase-admin'
import { playSong } from './songs'

async function songsHandler (bot: Client) {

    let player: { destroy: () => null } | null = null
    let lastSong: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | undefined = undefined

    firestore.collection('songs').orderBy('created_at').onSnapshot(async (songs) => {

        let connection = getVoiceConnection('704926597601296385')

        const song = songs.docs[0]
        const skipped = !lastSong ? false : songs.docs.filter((song) => lastSong?.id === song.id).length === 0

        if (!connection && song) {

            const { id, voiceAdapterCreator, members } = await bot.guilds.fetch('704926597601296385')
            const { voice } = await members.fetch(song.data().creator_id)

            voice.channelId && ( connection = joinVoiceChannel({
                channelId: voice.channelId,
                guildId: id,
                adapterCreator: voiceAdapterCreator

            }) )

        }

        if (connection) {

            skipped && player &&  ( player = player.destroy() )
            song && !player && ( player = playSong(connection, `https://www.youtube.com/watch?v=${song.data().video_id}`, () => firestore.doc(`/songs/${song.id}`).delete()) )

        }

        lastSong = song

    })

}

export default songsHandler