const Discord = require("discord.js");
const ms = require("ms");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    //!tempmute @user 1s/m/h/d
    if (
        !(
            message.member.hasPermission("ADMINISTRATOR") ||
            message.member.roles.some((role) => role.name === "Moderator")
        )
    )
        return message.channel.send("You don't have the permission!");

    let tomute = message.guild.member(
        message.mentions.users.first() || message.guild.members.get(args[0])
    );
    if (!tomute) return message.reply("Couldn't find user!");
    if (tomute.roles.some((role) => role.name === "Moderator"))
        return message.reply("Can't mute him!");

    let reason = args[2];
    if (!reason) reason = "No reason given";

    let mutetime = args[1];
    if (!mutetime) return message.reply("You didn't specify a time!");

    console.log(mutetime);
    let muteunit = mutetime[mutetime.length - 1];

    console.log(muteunit);

    if (!(muteunit === "m" || muteunit === "h" || muteunit === "s"))
        return message.channel.send(
            "please use a valid duration (10m for 10 minutes or 12h for 12 hours)"
        );

    let mutetimedisplay = mutetime;

    mutetime = mutetime.slice(0, -1);

    if (muteunit === "m") mutetime = mutetime * 1000 * 60;
    if (muteunit === "h") mutetime = mutetime * 1000 * 60 * 60;
    if (muteunit === "s") mutetime = mutetime * 1000;

    let muterole = message.guild.roles.find(`name`, "muted");

    //start of create role
    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: [],
            });
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    let embed = new Discord.RichEmbed()
        .setDescription("~Mute~")
        .setColor("#e56b00")
        .addField("Muted User", `${tomute} with ID ${tomute.id}`)
        .addField(
            "Muted By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Duration", mutetime)
        .addField("Reason", reason);

    let sChannel = message.guild.channels.find((c) => c.name === "mod-logs");
    sChannel.send(embed);
    //end of create roles
    // if (muteunit === "h") mutetime = mutetime * 3600000;
    // if (muteunit === "m")
    await tomute.addRole(muterole.id);
    message
        .reply(`<@${tomute.id}> has been muted for ${mutetimedisplay}`)
        .catch(console.error);

    console.log(mutetime);

    function timeout() {
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> has been unmuted!`);
    }

    setTimeout(timeout, mutetime);

    //end of module
};

module.exports.help = {
    name: "mute",
    description: "Mutes a user for given duration",
    usage: `${prefix}mute @username duration\nWhere duration can be m/h/s, for example, 1m = 1 minute.`,
};
