import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import { Client } from 'discord.js'
import { FieldValue } from 'firebase-admin/firestore'
import { firestore } from './firebase-admin'
import { playSong } from './songs'

interface FirebaseDocumentData {
	document_id: string
	guild_id: string
	user_id: string
	video_id: string
	video_title: string
	video_author: string
	created_at: FieldValue
}

async function songsHandler({ guilds }: Client) {
	const players = new Map<string, ReturnType<typeof playSong>>()

	firestore
		.collection('songs')
		.orderBy('created_at')
		.onSnapshot(async (songs) => {
			const song = songs.docs[0]
				? ({
						document_id: songs.docs[0].id,
						...songs.docs[0].data(),
				  } as FirebaseDocumentData)
				: null
			const skipped = isSkipped(songs.docChanges()[0])

			const guild = skipped
				? (songs.docChanges()[0].doc.data().guild_id as string)
				: song?.guild_id

			if (!guild) return

			let connection = getVoiceConnection(guild)

			if (!connection && song) {
				const { id, voiceAdapterCreator, members } = await guilds.fetch(
					guild
				)
				const { voice } = await members.fetch(song.user_id)

				voice.channelId &&
					(connection = joinVoiceChannel({
						channelId: voice.channelId,
						guildId: id,
						adapterCreator: voiceAdapterCreator,
					}))
			}

			if (connection) {
				if (skipped && players.has(guild)) {
					players.get(guild)!.destroy()
					players.delete(guild)
				}

				song &&
					!players.has(guild) &&
					players.set(
						guild,
						playSong(
							connection,
							`https://www.youtube.com/watch?v=${song.video_id}`,
							(skipped) =>
								!skipped &&
								firestore
									.doc(`/songs/${song.document_id}`)
									.delete()
						)
					)
			}
		})
}

const isSkipped = (
	document: FirebaseFirestore.DocumentChange<FirebaseFirestore.DocumentData>
) =>
	document !== undefined &&
	document.newIndex === -1 &&
	document.oldIndex === 0

export default songsHandler
