const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'banner',
  description: 'Kullanıcının bannerını alır ve gösterir.',
  category: 'Kullanıcı',
  usage: '<@kullanıcı>',
  async execute(message, args) {
    const targetUser = message.mentions.users.first() || message.author;

    // Fetch the user to get the banner information
    await targetUser.fetch();

    // Check if the user has a banner
    if (!targetUser.banner) {
      return message.reply('Bu kullanıcının bannerı bulunmuyor.');
    }

    const bannerEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${targetUser.tag} Kullanıcısının Bannerı`)
      .setDescription(`[Banner Bağlantısı](${targetUser.bannerURL({ format: 'png', size: 4096 })})`)
      .setImage(targetUser.bannerURL({ format: 'png', size: 4096 }))
      .setTimestamp()
      .setFooter({ text: 'Neksare', iconURL: 'https://i.imgur.com/ydwUxAq.png' });

    message.channel.send({ embeds: [bannerEmbed] });
  },
};
