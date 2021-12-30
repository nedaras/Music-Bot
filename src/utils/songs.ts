import { firestore } from './firebase-admin'
import ytdl from 'ytdl-core'
import { createAudioResource, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice'
import type { VoiceConnection } from '@discordjs/voice'

export const playSong = (connection: VoiceConnection, validUrl: string, onFinish?: (error: unknown) => void) => {

    const stream = ytdl(validUrl, { filter: 'audioonly' })
    const resource = createAudioResource(stream, { inlineVolume: true })
    
    resource.volume?.setVolume(0.2)
    
    const player = createAudioPlayer()

    connection.subscribe(player)
    player.play(resource)
    
    player.on(AudioPlayerStatus.Idle, () => {

        let error

        try { player.stop() } catch(_error) { error = _error }

        onFinish && onFinish(error)

    })

}

export const getCurrentSong = async () => {

    const songs = await firestore.collection('songs').orderBy('created_at').get()
    return songs.docs[0] ? configureObjet(songs.docs[0]) : null

}

const configureObjet = (song: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => ({
    delete: () => firestore.doc(`/songs/${song.id}`).delete(),
    url: `https://www.youtube.com/watch?v=${song.data().id}`

})