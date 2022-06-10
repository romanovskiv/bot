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
bot.hears('🌤 Прогноз погоды', async(ctx) => {
    try {
        const tempObj = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather?id=498817&units=metric&lang=ru&appid=ca2d4d1512a4e385e81176132d320c28'
        );
        console.log(tempObj.data);
        return ctx.replyWithMarkdown(`Cегодня в *${tempObj.data.name}e* ${tempObj.data.weather[0].description}

**_Cредняя температура_** : ${tempObj.data.main.temp} °C
**_Cкорость ветра_** : ${tempObj.data.wind.speed} м/с


`);
    } catch (error) {
        ctx.reply('Ошибка: ' + error);
    }
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
