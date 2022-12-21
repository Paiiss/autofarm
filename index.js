require('dotenv').config()
const { Client } = require('discord.js-selfbot-v13');
const config = require('./config.json')

// Config
const TOKEN = JSON.parse(process.env.TOKEN)
const reportChannelId = config.reportChannelId || config.channelId
const authorId = config.id, owoId = config.owoId

// Anticipate that the commands are not running at the same time
const random = (number = 10) => {
    return Math.floor(Math.random() * number)
}

for (const token of TOKEN) {
    let statusBot = true
    let channelId = token.split('#')[1] || config.channelId // (Default channel for send owo)

    // sendOwo function along with random extra time so it is not detected (trial)
    const sendOwo = (text, time = 15000) => {
        setTimeout(async () => {
            if (!statusBot) return sendOwo(text, time)
            console.log(`Send ${text}`)
            let channel = client.channels.cache.get(channelId);
            await channel.send(text)
            sendOwo(text, time)
        }, time + (random(9) * 1000))
    }

    const client = new Client({
        checkUpdate: false,
    })

    client.on('ready', async () => {
        console.log(`(${client.user.tag}) ready for auto farming`);
    })

    client.on('messageCreate', async (msg) => {
        if (msg.author.id === String(owoId) || msg.author.id === String(config.authorId)) {
            if (msg.content.toLowerCase().match(/human|captcha|dm|banned|https:\/\/owobot.com\/captcha|Beep|human\?/g) || msg.channel.type == 'dm') {
                if (msg.content.match(new RegExp(`${client.user.username}`))) {
                    statusBot = false
                    let getChannel = await client.channels.cache.get(reportChannelId)
                    let attachments = msg.attachments.map(e => e)
                    if (attachments.length == 0) return getChannel.send(`**[MSG]** ${msg.content}\n ${msg.guild ? `**[Server]** : ${msg.guild.name} (${msg.channel.name})` : ''}`)
                    return getChannel.send(`**[OwO]** ${msg.content}\nServer : [ ${msg.guild ? `**[Server]** : ${msg.guild.name} (${msg.channel.name})` : ''} ]\n**Link** : ${_dlink[0].url || 'Null'}\n<@${authorId}>`)
                }
            }
        }

        if (msg.content.match(/👍|verified|Thank/g) && msg.author.id == `${owoId}` && msg.channel.type == 'dm') {
            statusBot = true
            console.log(`(${client.user.tag}) Continue bots`)
        }

        if (msg.content.match(/!say/g) && msg.author == config.id) {
            msg.channel.send(msg.content.replace('!say ', ''))
        }

        // Message from Owo
        if (msg.author.id == `${owoId}` && msg.channel.type == 'dm') {
            let getId = await client.users.cache.get(config.authorId)
            getId.send(`**[OWO SAY]** ${msg.content}`)
        }
    })

    // Owo hunting
    sendOwo('owoh')

    // Owo battle 
    sendOwo('owob')

    // Owo coin flip
    sendOwo(`owocf 10`, 20000)

    // Owo pray
    sendOwo('owopray', 300000)

    // Owo cash
    sendOwo('owocash', 60000)

    client.login(token.split('#')[0]);
}