const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('hi');
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.hears('💰 Курсы волют', async(ctx) => {
    try {
        const currencyObj = await axios.get(
            'https://www.cbr-xml-daily.ru/daily_json.js'
        );
        return ctx.replyWithMarkdown(
            `
            📅 **_Курсы на сегодня_** :
  
💵 Доллар:  *${currencyObj.data.Valute.USD.Value}*
💶 Евро:  *${currencyObj.data.Valute.EUR.Value}*
🇹🇷 Турецкая лира:  *${currencyObj.data.Valute.TRY.Value}*
                        
**_на момент_** — *${currencyObj.data.Date.slice(
        0,
        10
      )}  ${currencyObj.data.Date.slice(11, 25)}*
`
        );
    } catch (error) {
        ctx.reply('Ошибка: ' + error);
    }
    //res.data.Valute.USD
});
bot.on('text', async(ctx) => {
    const keyboard = Keyboard.make([
        ['💰 Курсы волют'],
        ['🌤 Прогноз погоды']
    ]);

    await ctx.reply('Еще не готово', keyboard.reply());
});

bot.launch();
