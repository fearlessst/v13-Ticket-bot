const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

const config = require('../config.json');

module.exports = {
    name: 'guildBanRemove',
    execute(guild, user) {
      if (config.logChannelID) {
        const logChannel = guild.channels.cache.get(config.logChannelID);
        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Üye Yasak Kaldırıldı')
            .setDescription(`${user.tag} sunucudaki yasağı kaldırıldı.`)
            .setTimestamp();
  
          logChannel.send({ embeds: [embed] });
        }
      }
    },
  };
  