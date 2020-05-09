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
  g = client.guilds.cache.filter(g => g.name === 'Admin');
  // let guild = client.guilds..cache.find(guild => guild.name === "Discord.js Official");
  let guild = client.guilds.cache.find(guild => guild.name === "BOT");
  console.log(guild)
  
  // // const myMembers = guild.members.cache.map(m => console.log(m)); // OK
  // const myRoles = guild.roles.cache;
  // myRoles.map(r => {
  //   console.log("ROLES:")
  //   console.log(r.guild.roles.cache)
  // 
  //   console.log("----")
  //   // console.log(u.guild.user)
  // })
  
  constGuildRoles = guild.roles.cache.map(r => r.name)
  // console.log(constGuildRoles)
  
  let adminRole = guild.roles.cache.find(role => role.name == "Admin");

  // const myMembers = guild.members.cache.map(m => console.log(m)); // OK
  const myMembers = guild.members.cache;
  myMembers.map(u => {
    // console.log("USER:")
    console.log(u)
    // console.log(u.user)
    // console.log(u.user.id)
    // console.log(u.user.username)
    // console.log(u.user.bot)
    // console.log("----")
    // console.log(u.guild.user)
    if(u.roles.cache.has(adminRole.id)) {
      console.log(`Yay, the author of the message has the role!`);
      u.setNickname("[admin] " + u.user.username, "Set admin nick to " + u.user.username ) 
    } else {
      console.log(`Nope, noppers, nadda.`);
    }
  })
  
  
  // console.log(myMembers)
  
  
  // const guildNames = client.guilds.cache.map(g => g.name).join("\n")
  // console.log(guildNames)

  //console.log(client.guilds.cache)
  // console.log("Guild Admin:")
  // console.log(g)
  
  // const hasModRole = guild.members.roles.some(role => acceptedRoles.includes('Admin'));
  // console.log("hasModRole", hasModRole)
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
