const { Telegraf, Markup } = require('telegraf');

const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.hears('💰 Курсы валют', async(ctx) => {
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
bot.command('start', (ctx) => {
    return ctx.reply(
        'Узнай погоду и курсы валют на сегодня!',
        Markup.keyboard(['💰 Курсы валют', '🌤 Прогноз погоды'])
    );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
