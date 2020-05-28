const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    let kUser = message.guild.member(
        message.mentions.users.first() || message.guild.members.get(args[0])
    );
    if (!kUser) return message.channel.send("Can't find user!");
    if (
        !(
            message.member.hasPermission("ADMINISTRATOR") ||
            message.member.roles.some((role) => role.name === "Moderator")
        )
    )
        return message.channel.send("You don't have the permission!");

    if (kUser.roles.some((role) => role.name === "Moderator"))
        return message.channel.send("Can't kick a Moderator!");

    let kReason = args.join(" ").slice(22);
    if (!kReason) kReason = "No reason provided";

    let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#e56b00")
        .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
        .addField(
            "Kicked By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(
        (role) => role.name === "mod-logs"
    );

    if (!kickChannel)
        return message.channel.send(
            "Can't find #mod-logs channel. Please create one."
        );

    kickChannel.send(kickEmbed);

    message.guild.member(kUser).kick(kReason).catch(console.error);

    return message.reply(`Just kicked ${kUser} because ${kReason}`);
};
//name this whatever the command name is.
module.exports.help = {
    name: "kick",
    description: "Kicks a user!",
    usage: `${prefix}kick @username reason`,
};
