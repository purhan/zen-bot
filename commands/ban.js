const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    let bUser = message.guild.member(
        message.mentions.users.first() || message.guild.members.get(args[0])
    );
    if (!bUser) return message.channel.send("Can't find user!");
    if (!message.member.roles.some((role) => role.name === "Moderator"))
        return message.channel.send("You don't have the permission!");

    if (bUser.roles.some((role) => role.name === "Moderator"))
        return message.channel.send("Can't ban a Moderator!");

    let bReason = args.join(" ").slice(22);
    if (!bReason) bReason = "No reason provided";

    let banEmbed = new Discord.RichEmbed()
        .setDescription("~Ban~")
        .setColor("#d9534f")
        .addField("Banned User", `${bUser} with ID ${bUser.id}`)
        .addField(
            "Banned By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Reason", bReason);

    let banChannel = message.guild.channels.find(
        (role) => role.name === "mod-logs"
    );

    if (!banChannel)
        return message.channel.send(
            "Can't find #mod-logs channel. Please create one."
        );

    banChannel.send(banEmbed);

    message.guild.member(bUser).ban(bReason).catch(console.error);

    return message.reply(`Just banned ${bUser} because ${bReason}`);
};
//name this whatever the command name is.
module.exports.help = {
    name: "ban",
    description: "Bans a user!",
    usage: `${prefix}ban @username reason`,
};
