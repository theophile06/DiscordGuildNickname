// Va chercher les secrets dans le fichier secrets.js, dans le cas ou
// on est en local. Comme Heroku n'aime pas charger un module qui n'existe
// pas, il faut attraper l'erreur pour pas que cela plante...
var BoToken = null;
try {
  var s = require("./secrets");
  BoToken = s.BOT_TOKEN;
} catch (e) {
  console.log("Pas de secrets trouvé, on utilise process.env.BOT_TOKEN");
  //console.log(e);
  BoToken = process.env.BOT_TOKEN;
}

// Requière la librairie Discord
const { Client, RichEmbed, Attachment } = require('discord.js');

// Instancie un nouveau client Discord
const client = new Client();

// Surveille le status
client.on('ready', () => {
  console.log(client.guilds.cache.find(r => console.log(r.id, r.name))) // 708431087998861333 BOT

  // For every gilds of this server:
  client.guilds.cache.map(guild => {
    // console.log(guild)
    let adminRole = guild.roles.cache.find(role => role.name.toLowerCase() == "admin");
    // console.log("admin ID:", adminRole.id)

    // For every users
    guild.members.cache.map(u => {
      if (!u.user.bot) {
        if (u.roles.cache.has(adminRole.id)) {
          console.log(`<@${u.user.username}> got the admin role, changing nickname...`);
          u.setNickname("[admin] " + u.user.username, "Set admin nick to " + u.user.username ) 
        } else {
          console.log(`<@${u.user.username}> has not the admin role, doing nothing.`);
        }
      } else {
        console.log(`<@${u.user.username}> is a BOT, doing nothing.`);
      }
    })
  })

  console.log(`Logged in as ${client.user.tag}!`);
});

// Surveille les messages
client.on('message', msg => {

  if (msg.content === 'avatar') {     // si "avatar"
    // Retourne l'URL vers l'image de la personne
    msg.reply(msg.author.avatarURL);
  }

  if (msg.content === 'cat') {
    // Utilise http://random.cat pour afficher une image de chat...
    getJSON('http://aws.random.cat/meow', function(error, response){
      if (error) {
        console.log(error);
      } else {
        // On crée l'attachement
        const attachment = new Attachment(response.file);
        // Et on envoie le fichier dans le canal...
        msg.channel.send(attachment);
      }
    });
  }
});


// En cas de nouveaux arrivés...
client.on('guildMemberAdd', member => {
  // On envoie le message à un canal désigné, ici "gere-bot"
  const channel = member.guild.channels.find(ch => ch.name === 'gere-bot');
  // Si on ne trouve pas le canal, on fait rien
  if (!channel) return;
  // Autrement, on envoie le message dans le canal (plouf!)
  channel.send(`Bienvenue ${member}!`);
});

// Connect le client.
client.login(BoToken);
console.log("Le bot est démarré !");
