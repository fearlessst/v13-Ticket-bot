const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Kullanıcının avatarını alır ve bağlantılarını gösterir.',
  category: 'Kullanıcı',
  usage: '<@kullanıcı>',
  execute(message, args) {
    const targetUser = message.mentions.users.first() || message.author;

    const avatarSizes = [256, 512, 1024]; // Eklemek istediğiniz çözünürlükleri buraya ekleyin

    const avatarEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${targetUser.tag} Kullanıcısının Avatarı`)
      .setDescription('Avatar bağlantıları:')
      .addFields(
        avatarSizes.map(size => ({ name: `${size}x${size}`, value: `[Link](${targetUser.displayAvatarURL({ dynamic: true, size: size })})`, inline: true }))
      )
      .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTimestamp()
      .setFooter({ text: 'Neksare', iconURL: 'https://i.imgur.com/ydwUxAq.png' });

    message.channel.send({ embeds: [avatarEmbed] });
  },
};
