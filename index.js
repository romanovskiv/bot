const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', async(ctx) => {
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

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));