require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
	console.log(`${client.user.tag} discord bot is ready.`);
});

client.on("disconnected", () => {
	console.log("Disconnected!");
	process.exit(1);
});

client.on('error', error => {
	console.error(error);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
});