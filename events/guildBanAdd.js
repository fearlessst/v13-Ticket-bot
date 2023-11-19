const { prefix } = require('../config.json');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'guildBanAdd',
    execute(guild, user) {
      if (config.logChannelID) {
        const logChannel = guild.channels.cache.get(config.logChannelID);
        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Üye Yasaklandı')
            .setDescription(`${user.tag} sunucudan yasaklandı.`)
            .setTimestamp();
  
          logChannel.send({ embeds: [embed] });
        }
      }
    },
  };
  