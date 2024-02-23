
    const Discord = require('discord.js');
    const dotenv = require('dotenv')
    
    dotenv.config()
    const TOKEN = process.env.TOKEN


    const Client = new Discord.Client({
        intents: 33027
    })

  
    Client.on('ready', async ( client ) => {
         console.log('Estoy listo!')
    })


    Client.login(TOKEN)