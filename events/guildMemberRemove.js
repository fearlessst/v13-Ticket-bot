const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

const config = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
      if (config.logChannelID) {
        const logChannel = member.guild.channels.cache.get(config.logChannelID);
        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Üye Ayrıldı')
            .setDescription(`${member.user.tag} aramızdan ayrıldı.`)
            .setTimestamp();
  
          logChannel.send({ embeds: [embed] });
        }
      }
    },
  };
  