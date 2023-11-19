
const { Client, Intents, Collection, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const config = require('../config.json');
const client = new Client({ 
  disableMentions: 'everyone',
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ]
});


module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = interaction.client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(interaction, interaction.client);
    } catch (error) {
      console.error(error);
      await interaction.reply('Komut çalıştırılırken bir hata oluştu.');
    }
  },
}


