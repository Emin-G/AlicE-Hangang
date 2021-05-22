const { Client, Util, MessageEmbed } = require("discord.js");
const got = require('got');
require("dotenv").config();

const bot = new Client({
    disableMentions: "all"
});

const PREFIX = process.env.PREFIX;

bot.on("warn", console.warn);
bot.on("error", console.error);
bot.on("ready", () => console.log(`[Alice] ${bot.user.tag}`));
bot.on("ready", () =>
bot.user.setPresence({
    status: 'idle',
    activity: {
        name: '버그가 많네요!'
}}));

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    if (command === "한강" | command === "한강물" | command === "한강온도" | command === "한강수온" | command === "한강물온도") {
        var {body} = await got("http://openapi.seoul.go.kr:8088/" + process.env.SEOUL_API + "/json/WPOSInformationTime/1/5/", {
            hooks: {
                beforeError: [
                    error => {
                        const {response} = error;
                        if (response && response.body) {
                                const erembed = new MessageEmbed()
                                .setColor("#0x7d3640")
                                .setTitle(":triangular_flag_on_post:  **|**  **뭔가 오류가 났습니다..?**")
                                .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
                                return message.channel.send(erembed);
                            }
                        }
                    ]
                },
                responseType: 'json'
        });

        console.log(body);

        var saya = 0;

        const say = function () {
            if (body.WPOSInformationTime.row[saya].W_TEMP === "점검중") {
              saya ++;
              say();
            } else {
              goo();
            }
        }

        say();
        
        function goo () {
            const side = body.WPOSInformationTime.row[saya].SITE_ID;
            const msti = body.WPOSInformationTime.row[saya].MSR_TIME.split(":");
            const msda = body.WPOSInformationTime.row[saya].MSR_DATE;
            const temp = body.WPOSInformationTime.row[saya].W_TEMP;
            
            const resembed = new MessageEmbed()
            .setColor("#0x7d3640")
            .setTitle('**__' + temp + ' °C__**')
            .setDescription(side + "구역의 " + msda.slice(4, 6) + "월 " + msda.slice(6, 8) + "일 " + msti[0] + "시 " + ' 측정 자료 입니다.' )
            .setThumbnail("https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif")
            .setFooter("AlicE by.min_G");
            return message.channel.send(resembed);
        }
    }
    
});

bot.login(process.env.BOT_TOKEN);