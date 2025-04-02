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
    else if (text === "/ingredienti") {
        bot.sendMessage(chatId, "Inserisci ingredienti separati da una virgola es: tomato,potato,carrot");
        bot.once("message", async (msg) => {

            const ingredienti = msg.text;
            const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredienti}&apiKey=${ApiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
                
            if (data.length > 0) {
                const ricette = data.map(r => `Nome Ricetta: ${r.title}\nLink: https://spoonacular.com/recipes/${r.title.replace(/\s+/g, '-')}-${r.id}`).join('\n\n');
                bot.sendMessage(chatId, ricette);
            } else {
                bot.sendMessage(chatId, "Nessuna ricetta trovata con questi ingredienti.");
            }
        });
    } 
    else if (text === "/pasti") {
        bot.sendMessage(chatId, "Inserisci il tipo di pasto (lunch, dinner, breakfast)");
        bot.once("message", async (msg) => {

            const pasto = msg.text;
            const url = `https://api.spoonacular.com/recipes/complexSearch?type=${pasto}&number=6&apiKey=${ApiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.results.length > 0) {
                const ricette = data.results.map(element => `Nome Ricetta: ${element.title}\nLink: https://spoonacular.com/recipes/${element.title.replace(/\s+/g, '-')}-${element.id}`).join('\n\n');
                bot.sendMessage(chatId, ricette);
            } else {
                bot.sendMessage(chatId, "Nessuna ricetta trovata per questo tipo di pasto.");
            }
        });
    } 
    else if (text === "/allergeni") {
        bot.sendMessage(chatId, "Inserisci allergeni separati da una virgola es: tomato,potato,carrot");
        bot.once("message", async (msg) => {

            const allergeni = msg.text;
            const url = `https://api.spoonacular.com/recipes/complexSearch?intolerances=${allergeni}&number=6&apiKey=${ApiKey}`;

            const response = await fetch(url);
            const data = await response.json();

                
            if (data.results.length > 0) {
                const ricette = data.results.map(r => `Nome Ricetta: ${r.title}\nLink: https://spoonacular.com/recipes/${r.title.replace(/\s+/g, '-')}-${r.id}`).join('\n\n');                    bot.sendMessage(chatId, ricette);
            } else {
                bot.sendMessage(chatId, "Nessuna ricetta trovata senza questi allergeni.");
            }
        });
    }
});