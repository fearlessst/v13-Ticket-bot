const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'messageDelete',
    execute(message) {
      if (config.logChannelID) {
        const logChannel = message.guild.channels.cache.get(config.logChannelID);
        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Mesaj Silindi')
            .addFields(
              { name: 'Kullanıcı', value: message.author.tag, inline: true },
              { name: 'Kanal', value: message.channel.name, inline: true },
              { name: 'Silinen Mesaj', value: message.content }
            )
            .setTimestamp();
  
          logChannel.send({ embeds: [embed] });
        }
      }
    },
  };