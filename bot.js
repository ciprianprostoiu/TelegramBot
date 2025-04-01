const fs = require('fs');
const TelegramBot= require('node-telegram-bot-api')
const https = require('https');

const conf = JSON.parse(fs.readFileSync('conf.json'));
const token = conf.key
const ApiKey=conf.ApiKey

const bot = new TelegramBot(token, {polling: true});

bot.on("message", (msg)=> {
    const chatId= msg.chat.id;
    const text = msg.text;

    if (text === "/start"){
        bot.sendMessage(chatId, "Benvenuto nel Bot che ti salvera le serate con gli amici (/help per vedere i comandi)");
    }
    else if (text === "/help"){
        const help="Comandi disponibili: \n /ingredienti == inserisci ingredienti con cui vuoi cucinare e ti consigliamo le migliori ricette \n /pasti == ti cosiglia i migliori pasti da cucinare in base alla tipologia (cena,pranzo,colazione) \n /allergeni == ti consiglia i migliori pasti senza gli alimenti a cui sei allergico"
        bot.sendMessage(chatId, help);
    }
    else if(text === "/ingredienti"){
        bot.sendMessage(chatId, "Inserisci ingredienti separati da una virgola es: cocco,pomodoro,carota");
        bot.once("message", async(msg)=> {
            const ingredienti = msg.text;
            bot.sendMessage(chatId, "non è pronto!")
        })
    }
    else if(text === "/pasti"){
        bot.sendMessage(chatId, "Inserisci il tipo di pasto (cena,pranzo,colazione)");
        bot.once("message", async(msg)=> {
            const pasto = msg.text;
            bot.sendMessage(chatId, "non è pronto!")
        })
    }
    else if(text === "/allergeni"){
        bot.sendMessage(chatId, "Inserisci allergeni separati da una virgola es: cocco,pomodoro,carota");
        bot.once("message", async(msg)=> {
            const allergeni = msg.text;
            bot.sendMessage(chatId, "non è pronto!")
        })
    }
});