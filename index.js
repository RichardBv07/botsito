    // requerimentos
    const Discord = require('discord.js');

    // definir cliente
    const Client = new Discord.Client({
        intents: 33027
    })

    // contenido
    Client.on('ready', async ( client ) => {
         console.log('Estoy listo!')
    })

    // conectar
    Client.login('MTIwOTc3NDczMDg4MjcxOTc3Ng.GunfGC.FcYZzRvuwPVnzgdIEsNcvC1Mj6blEErDTvrRHA')