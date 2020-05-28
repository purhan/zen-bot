const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    let ubUser = await bot.fetchUser(args[0]);
    if (!ubUser)
        return message.channel.send(
            "Please provide a user id to unban someone!"
        );

    // let ubUser = message.guild.member(
    //     message.mentions.users.first() || message.guild.members.get(args[0])
    // );

    // let ubUser = bUser;

    if (!ubUser) return message.channel.send("Can't find user!");
    if (
        !(
            message.member.hasPermission("ADMINISTRATOR") ||
            message.member.roles.some((role) => role.name === "Moderator")
        )
    )
        return message.channel.send("You don't have the permission!");

    let ubReason = args.slice(1).join(" ");
    if (!ubReason) ubReason = "No reason provided";

    let unbanEmbed = new Discord.RichEmbed()
        .setDescription("~Unban~")
        .setColor("#d9534f")
        .addField("Unbanned User", `${ubUser} with ID ${ubUser.id}`)
        .addField(
            "Unbanned By",
            `<@${message.author.id}> with ID ${message.author.id}`
        )
        .addField("Time", message.createdAt)
        .addField("Reason", ubReason);

    let unbanChannel = message.guild.channels.find(
        (role) => role.name === "mod-logs"
    );

    if (!unbanChannel)
        return message.channel.send(
            "Can't find #mod-logs channel. Please create one."
        );

    unbanChannel.send(unbanEmbed).catch(console.error);

    // message.guild.member(ubUser).unban(ubReason).catch(console.error);
    message.guild.unban(ubUser).catch(console.error);

    return message.reply(`Just unbanned ${ubUser}${" because " + ubReason}`);
};
//name this whatever the command name is.
module.exports.help = {
    name: "unban",
    description: "Unbans a user! :D",
    usage: `${prefix}unban @username reason`,
};
