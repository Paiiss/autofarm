console.log("[Logger] Start bot, wait a minute ...")
const { Client, Intents, MessageEmbed } = require('discord.js-self');
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config()

// Settings
const config = require('./config.json')
let _aman = true
const auth = require('./token.js')

// Waktu spam
var owoh = 30 * 1000 // spam owo hunt
var owocash = 120 * 1000 // spam owo cash
var spamgaje = 180 * 1000 // spam asal
var owozoo = 300 * 1000 // spam owo zoo
var owoo = 65 * 1000 // Spam owo 
var owob = 15 * 1000 // Owo battel

// Server data
let _serverJSON = JSON.parse(fs.readFileSync('./db/server.json'))
let _server = _serverJSON[Math.floor(Math.random() * _serverJSON.length)];


for (const token of auth.Tokens) {

    // Create a new client instance
    const client = new Client({
        intents: 32767,
        partials: ['MESSAGE', 'CHANNEL', 'USER', 'REACTION'],
    });

    client.login(token);

    // When the client is ready, run this code (only once)
    client.once('ready', () => {
        console.log('-------------------------------');
        console.log('Client 1 Active !');
        console.log(client.user.tag);
        console.log('-------------------------------');
    });

    // Get all id server
    let _allserver = [];
    for (let i = 0; i < _serverJSON.length; i++) {
        _allserver.push(_serverJSON[i].guildId)
    }

    // Detected captcha
    client.on('message', msg => {
        if (msg.author.id === `${config.owoId}` || msg.author.id === `${config.authorId}`) {
            if (msg.content.toLowerCase().match(/human|captcha|dm|verify/g)) {
                if (_allserver.includes(msg.guild.id) || msg.channel.type == 'dm') {
                    _aman = false
                    let _paisse = client.users.cache.get(`${config.authorId}`)
                    _paisse.send('[DANGER] Terdeteksi kata kata meminta captcha!')
                    _paisse.send(`[Text] ${msg.content}`)
                    _paisse.send(`[Server] **${msg.guild.name} | ${msg.guild.id}**`)
                    console.log(`===> ${msg.content}`)
                }
            }
        }
        if (msg.content.match(/!aiueo/g)) {
            _aman = true
            msg.reply('Bot akan berjalan kembali');
            console.log(msg)
        }
    });

    // Random trus
    setInterval(() => {
        _server = _serverJSON[Math.floor(Math.random() * _serverJSON.length)];
    }, 13000)

    // Spam owoh
    setInterval(() => {
        if (_aman == false) return
        console.log(`[${client.user.tag}] send owoh to ${_server.name}`)
        let guild = client.guilds.cache.get(_server.guildId);
        let channel = guild.channels.cache.get(_server.channelId);
        channel.send('owoh')
    }, owoh)

    // Owob
    setInterval(() => {
        if (_aman == false) return
        let guild = client.guilds.cache.get(_server.guildId);
        let channel = guild.channels.cache.get(_server.channelId);
        channel.send('owob')
    }, owob)

}

// Anti crash
process.on("unhandledRejection", (reason, p) => {
    console.log("[antiCrash] : Unhandled Rejection/Catch");
    console.log(reason, p);
});

// Anti crash
process.on("uncaughtException", (err, origin) => {
    console.log("[antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
});

// Anti crash
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("[antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);

});
// Anti crash
process.on("multipleResolves", (type, promise, reason) => {
    console.log("[antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
});
