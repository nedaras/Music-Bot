import { createAudioResource, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice'
import type { VoiceConnection } from '@discordjs/voice'

import { firestore } from './firebase-admin'

import ytdl from 'ytdl-core'

interface Song {
    delete: () => Promise<FirebaseFirestore.WriteResult>;
    url: string;
}

export const playSong = (connection: VoiceConnection, validUrl: string, onFinish?: (error: unknown) => void) => {

    const stream = ytdl(validUrl, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }).on('error', (error) => {

        onFinish && onFinish(error)
        onFinish = undefined

    })

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

    return { 

        stop: () => {

            stream.destroy()
            player.stop()

        }

    }

}

export const onSongsUpdate = (): Promise<Song> => new Promise((resolve) => { firestore.collection('songs').orderBy('created_at').onSnapshot((songs) => (songs.docs[0] && resolve(configureObjet(songs.docs[0])))) })

export const onCurrentSongRemoved = (callback: () => void) => {

    return null

}

const configureObjet = (song: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>): Song => ({
    delete: () => firestore.doc(`/songs/${song.id}`).delete(),
    url: `https://www.youtube.com/watch?v=${song.data().id}`

})