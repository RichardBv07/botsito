const { Client, GatewayIntentBits, Events, Collection, EmbedBuilder } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('node:fs')
const path = require('node:path')

dotenv.config()
const TOKEN = process.env.TOKEN

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
})
client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`)
})

client.on(Events.MessageCreate, message => {
  if (message.content.startsWith('!enviarEmbed')) {
    // Extraer el contenido del mensaje JSON del comando
    const content = message.content.substring('!enviarEmbed'.length).trim()
    try {
      const embedData = JSON.parse(content)

      const embed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setDescription(embedData.description)
        .setColor(embedData.color)

      embedData.fields.forEach(field => {
        embed.addField(field.name, field.value, field.inline)
      })

      // Enviar el mensaje embed al canal de texto
      const channel = message.channel
      channel.send(embed)
    } catch (error) {
      message.reply('Error al analizar el JSON')
    }
  }
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

client.login(TOKEN)
