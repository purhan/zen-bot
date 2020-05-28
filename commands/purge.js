const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    if (
        !(
            message.member.hasPermission("ADMINISTRATOR") ||
            message.member.roles.some((role) => role.name === "Moderator")
        )
    )
        return message.channel.send("You don't have the permission!");

    message.channel.bulkDelete(args[0]).then(() => {
        message.channel
            .send(`Purged ${args[0]} messages.`)
            .then((msg) => msg.delete(5000));
    });
};
//name this whatever the command name is.
module.exports.help = {
    name: "purge",
    description: "Purges a number of commands in the channel",
    usage: `${prefix}purge number`,
};
