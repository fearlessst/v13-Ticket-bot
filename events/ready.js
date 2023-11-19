
module.exports = {
    name: 'ready',
    once: true, 
    async execute(client) {
      console.log(`Logged in as ${client.user.tag}`);
    },
  };

  const { Client } = require('discord.js');

  module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      const statusMessages = [
        { text: 'Support bot', type: 'PLAYING' },
        { text: 'Destek Botu', type: 'WATCHING' },
        { text: 'fearlesss.py', type: 'COMPETING' },
      ];
  
      function setStatus() {
        const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        client.user.setActivity(randomStatus.text, { type: randomStatus.type });
      }
  
      setStatus();
      setInterval(setStatus, 60000); // Durumu her 1 dakikada bir güncelleyecek
  
    },
  };
  