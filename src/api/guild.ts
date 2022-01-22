import { Client, InternalDiscordGatewayAdapterCreator } from 'discord.js'
import { Request, Response } from 'express'

interface ResponseType {
    guild_id: string

}

interface Error {
    status: number
    message: string

}

export default async function handler({ guilds }: Client, request: Request, response: Response<ResponseType | Error>) {

    const { guild_id } = request.body as { [key: string]: string | undefined }

    if (guild_id) {

        try {

            const { id } = await guilds.fetch(guild_id)
            if (id) return response.json({ guild_id: id })

        } catch {}

        return response.status(404).json({
            status: 404,
            message: 'guild not found'
    
        })

    }

    response.status(400).json({
        status: 400,
        message: 'field "guild_id" was not provided'

    })

}