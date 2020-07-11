require('dotenv').config();
const Discord = require('discord.js')
const lol = require('./lol');
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);
const prefix = "!";
const helpChampionCommand = "!champions <criteria> : Get all champions (optional criteria is champion name substring)";
const helpCounterCommand = "!counter <champion_name> [lane] : Get all counter picks of the given champion on lane"

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

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot){
        return;
    }
	const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(`command: ${command}, args`, args);

    if (command === 'help') {
		message.channel.send(`${helpChampionCommand}\n${helpCounterCommand}`);
	} else if (command === 'champions' || command === 'champs') {
        const criteria = args.length > 0 ? args[0] : null;
        const champions = await lol.getAllChampions(criteria);
		message.channel.send(champions);
    } else if (command === 'counter' || command === 'cnt') {
        const champion = args.length > 0 ? args[0] : null;
        const lane = args.length > 1 ? args[1] : null;
        const count = args.length > 2 ? parseInt(args[2]) : 10;
        let msg;
        if(champion){
            const counters = await lol.getAllCounters(champion, lane, count);
            msg = counters;
        } else {
            msg = "!counter: Missing champion name !";
        }
		message.channel.send(msg);
	} else {
        message.channel.send("Unknown command. Try !help.");
    }
});