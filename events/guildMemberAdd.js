const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

const config = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
      if (config.logChannelID) {
        const logChannel = member.guild.channels.cache.get(config.logChannelID);
        if (logChannel) {
          const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Üye Katıldı')
            .setDescription(`${member} aramıza katıldı!`)
            .setTimestamp();
  
          logChannel.send({ embeds: [embed] });
        }
      }
    },
  };
  