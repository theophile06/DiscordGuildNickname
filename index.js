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

function __setRoleNickname(u, myRoles) {
  if (myRoles.fondateur && u.roles.cache.has(myRoles.fondateur.id)) {
    console.log(`<@${u.user.username}> got the fondateur role, changing nickname...`);
    u.setNickname("[FON] " + u.user.username, "Set fondateur nick to " + u.user.username)
  } else if (myRoles.cofondateur && u.roles.cache.has(myRoles.cofondateur.id)) {
    console.log(`<@${u.user.username}> got the co-fondateur role, changing nickname...`);
    u.setNickname("[CF] " + u.user.username, "Set co-fondateur nick to " + u.user.username)
  } else if (myRoles.admin && u.roles.cache.has(myRoles.admin.id)) {
    console.log(`<@${u.user.username}> got the admin role, changing nickname...`);
    u.setNickname("[AD] " + u.user.username, "Set admin nick to " + u.user.username)
  } else if (myRoles.dev && u.roles.cache.has(myRoles.dev.id)) {
    console.log(`<@${u.user.username}> got the dev role, changing nickname...`);
    u.setNickname("[DEV] " + u.user.username, "Set dev nick to " + u.user.username)
  } else if (myRoles.modo && u.roles.cache.has(myRoles.modo.id)) {
    console.log(`<@${u.user.username}> got the modo role, changing nickname...`);
    u.setNickname("[MOD] " + u.user.username, "Set modo nick to " + u.user.username)
  } else if (myRoles.animateur && u.roles.cache.has(myRoles.animateur.id)) {
    console.log(`<@${u.user.username}> got the animateur role, changing nickname...`);
    u.setNickname("[ANI] " + u.user.username, "Set animateur nick to " + u.user.username)
  } else if (myRoles.youtuber && u.roles.cache.has(myRoles.youtuber.id)) {
    console.log(`<@${u.user.username}> got the youtuber role, changing nickname...`);
    u.setNickname("[YT] " + u.user.username, "Set youtuber nick to " + u.user.username)
  } else if (myRoles.vipplus && u.roles.cache.has(myRoles.vipplus.id)) {
    console.log(`<@${u.user.username}> got the VIP+ role, changing nickname...`);
    u.setNickname("[VIP+] " + u.user.username, "Set VIP+ nick to " + u.user.username)
  } else if (myRoles.vip && u.roles.cache.has(myRoles.vip.id)) {
    console.log(`<@${u.user.username}> got the VIP role, changing nickname...`);
    u.setNickname("[VIP] " + u.user.username, "Set VIP nick to " + u.user.username)
  } else if (myRoles.friends && u.roles.cache.has(myRoles.friends.id)) {
    console.log(`<@${u.user.username}> got the friends role, changing nickname...`);
    u.setNickname("[F] " + u.user.username, "Set friends nick to " + u.user.username)
  } else if (myRoles.membre && u.roles.cache.has(myRoles.membre.id)) {
    console.log(`<@${u.user.username}> got the member role, changing nickname...`);
    u.setNickname("[M] " + u.user.username, "Set member nick to " + u.user.username)
  } else {
    console.log(`No roles found for <@${u.user.username}>, resetting.`);
    u.setNickname(u.user.username, "Set member nick to " + u.user.username)
  }
}
function __updateNicknames(client) {
  console.log("--- setNicknameFromRoles ---");
  console.log(client.guilds.cache.find(r => console.log(r.id, r.name))) // 708431087998861333 BOT
  // For every gilds of this server:
  client.guilds.cache.map(guild => {
    console.log(guild.roles.cache.map(role => role.name).join(" / "))
    try {
      myRoles = {}
      myRoles.fondateur = guild.roles.cache.find(role => role.name.toLowerCase() == "[fondateur]") || false;
      myRoles.cofondateur = guild.roles.cache.find(role => role.name.toLowerCase() == "[co fondateur]") || false;
      myRoles.admin = guild.roles.cache.find(role => role.name.toLowerCase() == "[admin]") || false;
      myRoles.dev = guild.roles.cache.find(role => role.name.toLowerCase() == "[dévelopeur]") || false;
      myRoles.modo = guild.roles.cache.find(role => role.name.toLowerCase() == "[modo]") || false;
      myRoles.animateur = guild.roles.cache.find(role => role.name.toLowerCase() == "[animateur]") || false;
      myRoles.youtuber = guild.roles.cache.find(role => role.name.toLowerCase() == "[youtuber]") || false;
      myRoles.vipplus = guild.roles.cache.find(role => role.name.toLowerCase() == "[vip+]") || false;
      myRoles.vip = guild.roles.cache.find(role => role.name.toLowerCase() == "[vip]") || false;
      myRoles.friends = guild.roles.cache.find(role => role.name.toLowerCase() == "[friends]") || false;
      myRoles.membre = guild.roles.cache.find(role => role.name.toLowerCase() == "[membre]") || false;
    } catch (e) {
      // console.log(e)
    }

    // console.log("admin ID:", adminRole.id)

    // For every users
    guild.members.cache.map(u => {
      if (!u.user.bot) {
        __setRoleNickname(u, myRoles)
      } else {
        console.log(`<@${u.user.username}> is a BOT, doing nothing.`);
      }
    })
  })

}

// Surveille le status
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  __updateNicknames(client)
});

// Surveille les messages
client.on('message', msg => {

  if (msg.content === 'avatar') {     // si "avatar"
    // Retourne l'URL vers l'image de la personne
    msg.reply(msg.author.avatarURL);
  }

});

// https://stackoverflow.com/a/55429334
client.on('guildMemberUpdate', (oldMember, newMember) => {
  let oldM = oldMember._roles
  // console.log(oldM)
  let newM = newMember._roles
  // console.log(newM)
  if (oldM.length === newM.length && oldM.sort().every(function(value, index) { return value === newM.sort()[index]})) {
    console.log("guildMemberupdate: no change")
  } else {
    console.log("guildMemberupdate → __updateNicknames")
    __updateNicknames(client)
  }
});


// En cas de nouveaux arrivés...
client.on('guildMemberAdd', member => {
  // On envoie le message à un canal désigné, ici "gere-bot"
  // const channel = member.guild.channels.find(ch => ch.name === 'gere-bot');
  // Si on ne trouve pas le canal, on fait rien
  if (!channel) return;
  // Autrement, on envoie le message dans le canal (plouf!)
  channel.send(`Bienvenue ${member}!`);
});

// Connect le client.
client.login(BoToken);
console.log("Le bot est démarré !");
