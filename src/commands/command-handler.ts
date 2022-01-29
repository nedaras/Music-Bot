import type { Message } from 'discord.js'

import dashboard from './dashboard'

interface Commands {
	[key: string]: (args: string[], message: Message) => void
}

const commands: Commands = { dashboard }

export default function (message: Message) {
	if (message.author.bot) return

	const args = message.content.split(' ')
	let command = args[0].toLowerCase()

	args.shift()

	if (command.charAt(0) === process.env.DISCORD_CLIENT_PREFIX) {
		command = command.substring(1)

		commands[command] && commands[command](args, message)
	}
}
