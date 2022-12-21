require('dotenv').config()
const { Client } = require('discord.js-selfbot-v13');
const config = require('./config.json')

// Config
const TOKEN = JSON.parse(process.env.TOKEN) || process.env.TOKEN
const reportChannelId = config.reportChannelId || config.channelId
const authorId = config.id, owoId = config.owoId

// Anticipate that the commands are not running at the same time
const random = (number = 10) => {
    return Math.floor(Math.random() * number)
}

// Can run many bots depending on device capacity
for (const token of TOKEN) {
    let statusBot = true
    let channelId = token.split('xxxxx')[1] || config.channelId // (Default channel for send owo)

    // sendOwo function along with random extra time so it is not detected (trial)
    const sendOwo = (text, time = 15000) => {
        setTimeout(async () => {
            if (!statusBot) return sendOwo(text, time)
            console.log(`(${client.user.username}) send ${text}`)
            let channel = client.channels.cache.get(channelId);
            await channel.send(text)
            sendOwo(text, time)
        }, time + (random(9) * 1000))
    }

    const client = new Client({
        checkUpdate: false,
    })

    // To log in first, is there a simpler way?
    async function login() {
        // await client.login(token.split('xxxxx')[0]);
    }
    login()

    client.on('ready', async () => {
        console.log(`(${client.user.tag}) ready for auto farming`);
        client.user.setActivity({ name: "auto farming owo", type: 'PLAYING' })
    })

    client.on('messageCreate', async (msg) => {
        if (msg.author.id === String(owoId) || msg.author.id === String(config.authorId)) {
            if (msg.content.toLowerCase().match(/human|captcha|dm|banned|https:\/\/owobot.com\/captcha|Beep|human\?/g) || msg.channel.type == 'dm') {
                if (msg.content.match(new RegExp(`${client.user.username}`))) {
                    statusBot = false
                    let getChannel = await client.channels.cache.get(reportChannelId)
                    let attachments = msg.attachments.map(e => e)
                    if (attachments.length == 0) return getChannel.send(`**[MSG]** ${msg.content}\n ${msg.guild ? `**[Server]** : ${msg.guild.name} (${msg.channel.name})\n<@${authorId}>` : ''}`)
                    return getChannel.send(`**[OwO]** ${msg.content}\nServer : [ ${msg.guild ? `**[Server]** : ${msg.guild.name} (${msg.channel.name})` : ''} ]\n**Link** : ${attachments[0].url || 'Null'}\n<@${authorId}>`)
                }
            }
        }

        if (msg.content.match(/👍|verified|Thank you! :3/g) && msg.author.id == owoId && msg.channel.type == 'DM') {
            statusBot = true
            console.log(`(${client.user.tag}) Continue bots`)
            return
        }

        if (msg.content.match(/!say/g) && msg.author == config.id) {
            return msg.channel.send(msg.content.replace('!say ', ''))
        }

        // Message from Owo
        if (msg.author.id == owoId && msg.channel.type == 'DM') {
            let getId = client.users.cache.get(config.authorId)
            return getId.send(`**[OWO SAY]** ${msg.content}`)
        }

        if (msg.content.match(new RegExp(`!${client.user.username}`))) {
            let getId = client.users.cache.get(owoId)
            getId.send(msg.content.replace(`!${client.user.username} `, '')).catch((e) => console.log('Unable to send chat to guys'))
        }
    })

    // Owo hunting
    sendOwo('owoh')

    // Owo battle 
    sendOwo('owob')

    // Owo coin flip
    sendOwo(`owocf 5`, 300000)

    // Owo pray
    sendOwo('owopray', 300000)

    // Owo cash
    sendOwo('owocash', 60000)
}