const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'userinfo',
  category: 'Kullanıcı',
  description: 'Kullanıcının bilgilerini gösterir.',
  execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    if (!member) {
      return message.channel.send('Geçerli bir kullanıcı etiketleyin.');
    }

    const roles = member.roles.cache
      .filter((role) => role.id !== message.guild.id)
      .map((role) => role.name)
      .join(', ');

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Kullanıcı Bilgileri')
      .setThumbnail(user.avatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Kullanıcı Adı', value: user.username, inline: true },
        { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
        { name: 'Bot mu?', value: user.bot ? 'Evet' : 'Hayır', inline: true },
        { name: 'Oluşturulma Tarihi', value: user.createdAt.toUTCString(), inline: true },
        { name: 'Sunucudaki İsmi', value: member.nickname || 'Yok', inline: true },
        { name: 'Sunucuya Katılma Tarihi', value: member.joinedAt.toUTCString(), inline: true },
        { name: 'Roller', value: roles || 'Yok', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: user.tag, iconURL: user.avatarURL({ dynamic: true }) });

    message.channel.send({ embeds: [embed] });
  },
};
