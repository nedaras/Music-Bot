import {
	createAudioResource,
	createAudioPlayer,
	AudioPlayerStatus,
} from '@discordjs/voice'
import type { VoiceConnection } from '@discordjs/voice'

import ytdl from 'discord-ytdl-core'

export interface Song {
	delete: () => Promise<FirebaseFirestore.WriteResult>
	url: string
	id: string
	creatorId: string
}

export const playSong = (
	connection: VoiceConnection,
	validUrl: string,
	onFinish: (skipped: boolean) => void
) => {
	const stream = ytdl(validUrl, {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
		// discord-ytdl-core
		opusEncoded: true,
		fmt: 's16le',
		encoderArgs: ['-af', 'bass=g=1:f=110:w=0.3'],
	})

	const resource = createAudioResource(stream, { inlineVolume: true })

	resource.volume?.setVolume(0.2)

	const player = createAudioPlayer()

	const subsciber = connection.subscribe(player)
	player.play(resource)

	let force = false
	player.on(AudioPlayerStatus.Idle, () => {
		stream.destroy()
		subsciber?.unsubscribe()
		player.stop()

		onFinish(force)
	})

	return {
		destroy: () => {
			player.stop((force = true))
			return null
		},
	}
}
