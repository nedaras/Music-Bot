import type { Message } from 'discord.js'

export default async function (_: string[], message: Message) {
	message.guild &&
		message.channel.send(
			`http://localhost:3000/dashboard/${message.guild.id}`
		)
}
