// events/messageCreate.js
const { MessageEmbed } = require('discord.js');

const { prefix } = require('../config.json');
const config = require('../config.json');

module.exports = {
  name: 'messageCreate',
  execute(message, client) {

    if (message.author.bot) return;

    // Küfür filtresi
    if (config.profanityFilterEnabled) {
      const profanityList = ["amk", "ananı", "sikerim", "aq", "sikim", "sikeyim", "orospu", "oç"]; // Küfür listesi, config.json'dan alabilirsiniz.
      const words = message.content.split(/\s+/);

      for (const word of words) {
        if (profanityList.includes(word.toLowerCase())) {
          message.delete();
          message.channel.send(`${message.author}, lütfen küfürlü konuşmaktan kaçının.`);
          break;
        }
      }
    }

    // Link filtresi
    if (config.linkFilterEnabled) {
      if (message.content.includes('http://') || message.content.includes('https://')) {
        message.delete();
        message.channel.send(`${message.author}, lütfen link paylaşmayın.`);
      }
    }

    // Reklam filtresi
    if (config.advertisementFilterEnabled) {
      if (message.content.includes('discord.gg/')) {
        message.delete();
        message.channel.send(`${message.author}, lütfen reklam yapmayın.`);
      }
    }

    // Komutları çalıştırma
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('Komut çalıştırılırken bir hata oluştu.');
    }
  },
};
