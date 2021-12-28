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

        try {

            player.stop()
            //connection.destroy()

        } catch(_error) { error = _error }

        onFinish && onFinish(error)

    })

}