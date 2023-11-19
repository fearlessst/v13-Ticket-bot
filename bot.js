const { Client, Intents, Collection, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

const client = new Client({
  disableMentions: 'everyone',
  intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
    Intents.FLAGS.GUILD_PRESENCES
  ]
});

const fs = require('fs');

// Load config file
const config = require('./config.json');
const { token } = config;

// Command handler
client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

// Event handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Kategoriler ve yetkililer
const kategoriler = ["Şikayet", "Bot satın al","Hosting satın al","VDS satın al", "Soru"];
const yetkililer = [""]; // Yetkililerin ID'lerini ekleyin


const embedColor = '#3498db';


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!ticket') {

    const categoryButtons = kategoriler.map((category) =>
      new MessageButton()
        .setCustomId(category)
        .setLabel(category)
        .setStyle('PRIMARY')
    );

    const categoryRow = new MessageActionRow()
      .addComponents(categoryButtons);

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Ticket Oluşturma')
      .setDescription('Aşağıdaki kategorilerden birini seçerek bir ticket oluşturabilirsiniz. Ticketınız ilgili yetkililere yönlendirilecektir. Ticketı kapattığınızda otomatik olarak silinecektir.\n\n'
        + '1. **Şikayet**: Bir şikayet bildirmek için bu kategoriyi seçin.\n'
        + '2. **Bot satın al**: Bot satın almak için bu kategoriyi seçin.\n'
        + '3. **Hosting satın al**: Hosting satın almak için bu kategoriyi seçin.\n'
        + '4. **VDS satın al**: VDS satın almak için bu kategoriyi seçin.\n'
        + '5. **Soru**: Bir soru sormak veya bilgi almak için bu kategoriyi seçin.')
      .setTimestamp();

    message.reply({
      embeds: [embed],
      components: [categoryRow]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const selectedCategory = interaction.customId;
  const user = interaction.user;
  const guild = interaction.guild;

  
  if (kategoriler.includes(selectedCategory)) {
    const ticketChannel = await guild.channels.create(`${selectedCategory}-ticket`, {
      type: 'text',
      parent: '', // Ticket kanallarının oluşturulacağı kategori ID'si
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['VIEW_CHANNEL']
        },
        {
          id: user.id,
          allow: ['VIEW_CHANNEL']
        },
        ...yetkililer.map((yetkili) => ({
          id: yetkili,
          allow: ['VIEW_CHANNEL']
        }))
      ]
    });

    const ticketMessage = await ticketChannel.send(`**Ticket açan kişi:** ${user}\n**Kategori: ${selectedCategory}**`);


    const assignButtons = yetkililer.map((yetkili) =>
      new MessageButton()
        .setCustomId(`assign_${yetkili}`)
        .setLabel(`Yetkili: ${yetkili}`)
        .setStyle('SUCCESS')
    );

    // Ticketı kapatma düğmesi
    const closeButton = new MessageButton()
      .setCustomId('close_ticket')
      .setLabel('Ticket Kapat')
      .setStyle('DANGER');

    const actionRow = new MessageActionRow()
      .addComponents(assignButtons)
      .addComponents(closeButton);

    const assignEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Yetkili Atama')
      .setDescription(`**Ticket açan kişi:** ${user}\n**Kategori:** ${selectedCategory}\n\nAşşağıda bulunan butonlardan birine basarak yetkili ekibimizi seçebilirsiniz.`)
      .setTimestamp();

    ticketChannel.send({
      embeds: [assignEmbed],
      components: [actionRow]
    });

    const waitingEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Ticket Açılıyor')
      .setDescription(`Ticket açma işlemi tamamlandı. Yetkililer tarafından inceleniyor, lütfen bekleyin...`)
      .setTimestamp();

    ticketMessage.edit({ embeds: [waitingEmbed] });
  }

  if (interaction.customId.startsWith('assign_')) {
    const assignedYetkili = interaction.customId.split('_')[1];
    const ticketChannel = interaction.channel;
    const user = interaction.user;

    if (yetkililer.includes(assignedYetkili)) {
      // Yetkiliyi ticket kanalına ekle
      ticketChannel.permissionOverwrites.create(assignedYetkili, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
      });

      const assignedEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setDescription(`**Ticket yetkilisi:** ${user} oldu. Ticket kapandıktan sonra puanlamayı unutmayın.`);
      ticketChannel.send({ embeds: [assignedEmbed] });
    }
  }

  if (interaction.customId === 'close_ticket') {
    if (yetkililer.includes(interaction.user.id)) {
      const ticketChannel = interaction.channel;
  
      ticketChannel.send('Ticket kapatılıyor...').then(() => {
        ticketChannel.delete();

        sendSurvey(interaction.user);
      });
    } else {
      interaction.reply('Bu işlem için yetkiniz yok.');
    }
  }
});

async function sendSurvey(user) {
  const embedColor = '#3498db';

  const surveyEmbed = new MessageEmbed()
    .setColor(embedColor)
    .setTitle('Memnuniyet Anketi')
    .setDescription('Lütfen sizinle ilgilenen yetkiliyi oylayın (verdiğiniz puanlamalar göz önünde bulundurulucaktır lütfen adil şekilde anketi doldurun.)')
    .setTimestamp();

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('5')
        .setLabel('Çok iyi')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('4')
        .setLabel('İyi')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('3')
        .setLabel('Normal')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('2')
        .setLabel('Kötü')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('1')
        .setLabel('Çok Kötü')
        .setStyle('PRIMARY')
    );

  const sentMessage = await user.send({ embeds: [surveyEmbed], components: [row] });

  const filter = (interaction) => interaction.user.id === user.id;
  const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', (interaction) => {
    const satisfaction = {
      '5': 'Çok İyi',
      '4': 'İyi',
      '3': 'Normal',
      '2': 'Kötü',
      '1': 'Çok Kötü',
    };
    const selectedSatisfaction = satisfaction[interaction.customId];
    const channel = client.channels.cache.get(''); // Puanlamaların gönderileceği kanalın ID'sini buraya girin

    const scoreEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Memnuniyet Puanı')
      .setDescription(`${user} kullanıcısının memnuniyet puanı: **${selectedSatisfaction}**`)
      .setTimestamp();

    channel.send({ embeds: [scoreEmbed] });

    sentMessage.edit({ embeds: [surveyEmbed.setDescription('Teşekkür ederiz!')], components: [] });
  });

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      sentMessage.edit({ embeds: [surveyEmbed.setDescription('Anketin süresi doldu. Teşekkür ederiz!')], components: [] });
    }
  });
}


client.once('ready', () => {
  console.log('Bot çalışıyor!');
});

client.login(token);
