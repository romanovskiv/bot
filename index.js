const { Telegraf, Markup } = require('telegraf');

const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const weatherIcon = new Map([
    ['01d', '🌞'],
    ['02d', '🌤'],
    ['03d', '🌥'],
    ['04d', '☁️'],
    ['09d', '🌧'],
    ['10d', '🌦'],
    ['11d', '⛈⚡️'],
    ['13d', '❄️'],
    ['50d', '🌫'],
    ['01n', '🌞🌑'],
    ['02n', '🌤🌑'],
    ['03n', '☁️🌑'],
    ['04n', '☁️⚫️🌑'],
    ['09n', '🌧🌑'],
    ['10n', '🌦🌑'],
    ['11n', '⛈⚡️🌑'],
    ['13n', '❄️🌑'],
    ['50n', '🌫🌑'],
]);
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
  🇹🇷 Турецкая лира:  *${(currencyObj.data.Valute.TRY.Value / 10).toFixed(4)}*
  
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
        return await ctx.reply('<b>Выберите город</b> ✔️', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('Санкт-Петербург', 'btn_spb')],
                [
                    Markup.button.callback('Ростов', 'btn_rostov'),
                    Markup.button.callback('Сочи', 'btn_sochi'),
                ],
                [Markup.button.callback('Ввести свой город', 'btn_search')],
            ]),
        });
    } catch (error) {
        await ctx.reply('Ошибка: ' + error);
    }
});

let conditionToStopEaringMessages;

bot.action('btn_search', async(ctx) => {
    try {
        conditionToStopEaringMessages = false;
        ctx.reply('Введите город на английском языке');

        bot.on('text', async(ctx) => {
            try {
                if (!conditionToStopEaringMessages) {
                    const city = ctx.message.text;
                    const tempObj = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&UTC&lang=ru&appid=ca2d4d1512a4e385e81176132d320c28`
                    );
                    console.log(tempObj.data);
                    const currentWeatherIcon = weatherIcon.get(
                        tempObj.data.weather[0].icon
                    );

                    // Закат
                    const unixTimestampSunset = tempObj.data.sys.sunset;
                    const millisecondsSunset = unixTimestampSunset * 1000;
                    const dateObjectSunset = new Date(millisecondsSunset);
                    const humanDateFormatSunset = dateObjectSunset.toLocaleString(
                        'ru-RU', {
                            timeZone: 'Europe/Moscow',
                        }
                    );

                    // Рассвет
                    const unixTimestampSunrise = tempObj.data.sys.sunrise;
                    const millisecondsSunrise = unixTimestampSunrise * 1000;
                    const dateObjectSunrise = new Date(millisecondsSunrise);
                    const humanDateFormatSunrise = dateObjectSunrise.toLocaleString(
                        'ru-RU', {
                            timeZone: 'Europe/Moscow',
                        }
                    );

                    // Бот
                    await ctx.replyWithMarkdown(`Cегодня в *${tempObj.data.name}* ${
            tempObj.data.weather[0].description
          }  ${currentWeatherIcon}
            
🌡 **_Погода сейчас_** :  ${tempObj.data.main.temp.toFixed(1)} °C
🗿 **_Ощущается как_** :  ${tempObj.data.main.feels_like.toFixed(1)} °C
🔺 **_Максимальная температура_** :  ${tempObj.data.main.temp_max.toFixed(1)} °C
🔻 **_Минимальная температура_** :  ${tempObj.data.main.temp_min.toFixed(1)} °C
💨 **_Cкорость ветра_** :  ${tempObj.data.wind.speed} м/с
💦 **_Влажность воздуха_** :  ${tempObj.data.main.humidity} %

🌄 **_Рассвет_** :  ${humanDateFormatSunrise} 
🌇 **_Закат_** :  ${humanDateFormatSunset} 
            
            
            `);

                    // if (tempObj.data.rain) {
                    //     ctx.reply(
                    //         `🌧**_Вероятность дождя_** : ${tempObj.data.rain['1h'] * 100} %`
                    //     );
                    // } else {
                    //     ctx.replyWithMarkdown(`🌧**_Вероятность дождя_** : 0 %`);
                    // }

                    conditionToStopEaringMessages = true;
                }
            } catch (error) {
                await ctx.reply('Город не найдет, попробуйте ввести другой город');
            }
        });
    } catch (error) {
        await ctx.reply('Ошибка: ' + error);
    }
});

bot.action('btn_spb', async(ctx) => {
    try {
        await ctx.answerCbQuery();
        const tempObj = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather?id=498817&units=metric&UTC&lang=ru&appid=ca2d4d1512a4e385e81176132d320c28'
        );
        console.log(tempObj.data);
        const currentWeatherIcon = weatherIcon.get(tempObj.data.weather[0].icon);

        // Закат
        const unixTimestampSunset = tempObj.data.sys.sunset;
        const millisecondsSunset = unixTimestampSunset * 1000;
        const dateObjectSunset = new Date(millisecondsSunset);
        const humanDateFormatSunset = dateObjectSunset.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Рассвет
        const unixTimestampSunrise = tempObj.data.sys.sunrise;
        const millisecondsSunrise = unixTimestampSunrise * 1000;
        const dateObjectSunrise = new Date(millisecondsSunrise);
        const humanDateFormatSunrise = dateObjectSunrise.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Бот
        await ctx.replyWithMarkdown(`Cегодня в *${tempObj.data.name}e* ${
      tempObj.data.weather[0].description
    }  ${currentWeatherIcon}

🌡 **_Погода сейчас_** :  ${tempObj.data.main.temp.toFixed(1)} °C
🗿 **_Ощущается как_** :  ${tempObj.data.main.feels_like.toFixed(1)} °C
🔺 **_Максимальная температура_** :  ${tempObj.data.main.temp_max.toFixed(1)} °C
🔻 **_Минимальная температура_** :  ${tempObj.data.main.temp_min.toFixed(1)} °C
💨 **_Cкорость ветра_** :  ${tempObj.data.wind.speed} м/с
💦 **_Влажность воздуха_** :  ${tempObj.data.main.humidity} %

🌄 **_Рассвет_** :  ${humanDateFormatSunrise} 
🌇 **_Закат_** :  ${humanDateFormatSunset} 


`);

        // if (tempObj.data.rain) {
        //     ctx.reply(
        //         `🌧**_Вероятность дождя_** : ${tempObj.data.rain['1h'] * 100} %`
        //     );
        // } else {
        //     ctx.replyWithMarkdown(`🌧**_Вероятность дождя_** : 0 %`);
        // }
    } catch (error) {
        await ctx.reply('Ошибка: ' + error);
    }
});

bot.action('btn_rostov', async(ctx) => {
    try {
        await ctx.answerCbQuery();
        const tempObj = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather?id=501175&units=metric&UTC&lang=ru&appid=ca2d4d1512a4e385e81176132d320c28'
        );
        console.log(tempObj.data);
        const currentWeatherIcon = weatherIcon.get(tempObj.data.weather[0].icon);

        // Закат
        const unixTimestampSunset = tempObj.data.sys.sunset;
        const millisecondsSunset = unixTimestampSunset * 1000;
        const dateObjectSunset = new Date(millisecondsSunset);
        const humanDateFormatSunset = dateObjectSunset.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Рассвет
        const unixTimestampSunrise = tempObj.data.sys.sunrise;
        const millisecondsSunrise = unixTimestampSunrise * 1000;
        const dateObjectSunrise = new Date(millisecondsSunrise);
        const humanDateFormatSunrise = dateObjectSunrise.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Бот
        await ctx.replyWithMarkdown(`Cегодня в *${tempObj.data.name}* ${
      tempObj.data.weather[0].description
    }  ${currentWeatherIcon}

🌡 **_Погода сейчас_** :  ${tempObj.data.main.temp.toFixed(1)} °C
🗿 **_Ощущается как_** :  ${tempObj.data.main.feels_like.toFixed(1)} °C
🔺 **_Максимальная температура_** :  ${tempObj.data.main.temp_max.toFixed(1)} °C
🔻 **_Минимальная температура_** :  ${tempObj.data.main.temp_min.toFixed(1)} °C
💨 **_Cкорость ветра_** :  ${tempObj.data.wind.speed} м/с
💦 **_Влажность воздуха_** :  ${tempObj.data.main.humidity} %

🌄 **_Рассвет_** :  ${humanDateFormatSunrise} 
🌇 **_Закат_** :  ${humanDateFormatSunset} 


`);

        // if (tempObj.data.rain) {
        //     ctx.reply(
        //         `🌧**_Вероятность дождя_** : ${tempObj.data.rain['1h'] * 100} %`
        //     );
        // } else {
        //     ctx.replyWithMarkdown(`🌧**_Вероятность дождя_** : 0 %`);
        // }
    } catch (error) {
        await ctx.reply('Ошибка: ' + error);
    }
});

bot.action('btn_sochi', async(ctx) => {
    try {
        await ctx.answerCbQuery();
        const tempObj = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather?id=491422&units=metric&UTC&lang=ru&appid=ca2d4d1512a4e385e81176132d320c28'
        );
        console.log(tempObj.data);
        const currentWeatherIcon = weatherIcon.get(tempObj.data.weather[0].icon);

        // Закат
        const unixTimestampSunset = tempObj.data.sys.sunset;
        const millisecondsSunset = unixTimestampSunset * 1000;
        const dateObjectSunset = new Date(millisecondsSunset);
        const humanDateFormatSunset = dateObjectSunset.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Рассвет
        const unixTimestampSunrise = tempObj.data.sys.sunrise;
        const millisecondsSunrise = unixTimestampSunrise * 1000;
        const dateObjectSunrise = new Date(millisecondsSunrise);
        const humanDateFormatSunrise = dateObjectSunrise.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
        });

        // Бот
        await ctx.replyWithMarkdown(`Cегодня в *${tempObj.data.name}* ${
      tempObj.data.weather[0].description
    }  ${currentWeatherIcon}

🌡 **_Погода сейчас_** :  ${tempObj.data.main.temp.toFixed(1)} °C
🗿 **_Ощущается как_** :  ${tempObj.data.main.feels_like.toFixed(1)} °C
🔺 **_Максимальная температура_** :  ${tempObj.data.main.temp_max.toFixed(1)} °C
🔻 **_Минимальная температура_** :  ${tempObj.data.main.temp_min.toFixed(1)} °C
💨 **_Cкорость ветра_** :  ${tempObj.data.wind.speed} м/с
💦 **_Влажность воздуха_** :  ${tempObj.data.main.humidity} %

🌄 **_Рассвет_** :  ${humanDateFormatSunrise} 
🌇 **_Закат_** :  ${humanDateFormatSunset} 


`);

        // if (tempObj.data.rain) {
        //     ctx.reply(
        //         `🌧**_Вероятность дождя_** : ${tempObj.data.rain['1h'] * 100} %`
        //     );
        // } else {
        //     ctx.replyWithMarkdown(`🌧**_Вероятность дождя_** : 0 %`);
        // }
    } catch (error) {
        await ctx.reply('Ошибка: ' + error);
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
