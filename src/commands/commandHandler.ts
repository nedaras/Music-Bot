import type { Message } from 'discord.js'
import { prefix } from '../../bot.json'

import dashboard from './dashboard'

interface Commands { [key: string]: (args: string[], message: Message) => void }

const commands: Commands = { dashboard }

export default function (message: Message) {

    if (message.author.bot) return

    const args = message.content.split(' ')
    let command = args[0].toLowerCase()

    args.shift()
    
    if (command.charAt(0) === prefix) {

        command = command.substring(1)

        commands[command] && commands[command](args, message)

    }

}