import { Client } from 'discord.js'
import { Request, Response } from 'express'

interface ResponseType {
	channel_id: string
}

interface Error {
	status: number
	message: string
}

export default async function handler(
	{ guilds }: Client,
	request: Request,
	response: Response<ResponseType | Error>
) {
	const { guild_id, user_id } = request.body as {
		[key: string]: string | undefined
	}

	if (guild_id && user_id) {
		try {
			const { members } = await guilds.fetch(guild_id)
			const { voice } = await members.fetch(user_id)
			if (voice.channelId)
				return response.json({ channel_id: voice.channelId })
			return response.status(404).json({
				status: 404,
				message: 'voice channel not found',
			})
		} catch {
			return response.status(404).json({
				status: 404,
				message: 'wrong "guild_id" or "user_id" field provided',
			})
		}
	}

	response.status(400).json({
		status: 400,
		message: 'no "guild_id" or "user_id" field provided',
	})
}
