const Discord = require("discord.js");
const config = require("../config.json");
const colours = require("../colours.json");
const ms = require("ms");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    if (
        !(
            message.member.hasPermission("ADMINISTRATOR") ||
            message.member.roles.some((role) => role.name === "Moderator")
        )
    )
        return message.channel.send("You don't have the permission!");

    //define the reason and mutee
    let mutee =
        message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!mutee)
        return message.channel.send("Please supply a user to be muted!");

    if (mutee.roles.some((role) => role.name === "Moderator"))
        return message.channel.send("Can't mute a Moderator!");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given";

    //define mute role and if the mute role doesnt exist then create one
    let muterole = message.guild.roles.find(`name`, "muted");
    // console.log(muterole);
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
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false,
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    //send an embed to the modlogs channel
    let embed = new Discord.RichEmbed()
        .setDescription("~Super Mute~")
        .setColor("#e56b00")
        .addField("Muted User", `${mutee} with ID ${mutee.id}`)
        .addField(
            "Kicked By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

    let sChannel = message.guild.channels.find((c) => c.name === "mod-logs");
    sChannel.send(embed);

    //add role to the mentioned user and also send the user a dm explaing where and why they were muted
    mutee.addRole(muterole.id).then(() => {
        // message.delete();
        mutee
            .send(
                `Hello, you have been super muted in ${message.guild.name} for: ${reason}`
            )
            .catch((err) => console.log(err));
        // message.channel.send(`${mutee.user.username} was successfully muted.`);
    });
    // .removeRole(muterole.id);
};
//name this whatever the command name is.
module.exports.help = {
    name: "supermute",
    description: "Mutes a user for indefinite duration!",
    usage: `${prefix}supermute @username reason`,
};
