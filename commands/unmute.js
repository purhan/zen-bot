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

    //define the reason and unmutee
    let unmutee =
        message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!unmutee)
        return message.channel.send("Please supply a user to be unmuted!");

    if (unmutee.roles.some((role) => role.name === "Moderator"))
        return message.channel.send("Can't unmute a Moderator!");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given";

    //define unmute role and if the unmute role doesnt exist then create one
    let unmuterole = message.guild.roles.find(`name`, "muted");
    console.log(unmuterole);
    if (!unmuterole) {
        try {
            unmuterole = await message.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions: [],
            });
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(unmuterole, {
                    SEND_MESSAGES: false,
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    //send an embed to the modlogs channel
    let embed = new Discord.RichEmbed()
        .setDescription("~Unmute~")
        .setColor("#e56b00")
        .addField("muted User", `${unmutee} with ID ${unmutee.id}`)
        .addField(
            "Kicked By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

    let sChannel = message.guild.channels.find((c) => c.name === "mod-logs");
    sChannel.send(embed);

    unmutee.removeRole(unmuterole.id).then(() => {
        // message.delete();
        unmutee
            .send(
                `Hello, you have been unmuted in ${message.guild.name} for: ${reason}`
            )
            .catch((err) => console.log(err));
        // message.channel.send(`${unmutee.user.username} was successfully unmuted.`);
    });
    // .removeRole(unmuterole.id);
};
//name this whatever the command name is.
module.exports.help = {
    name: "unmute",
    description: "Unmutes a user!",
    usage: `${prefix}unmute @username reason`,
};
