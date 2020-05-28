const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    const channel = message.guild.channels.find(
        (channel) => channel.name === "announcements"
    );
    if (
        message.member.hasPermission("ADMINISTRATOR") &&
        message.guild.channels.find(
            (channel) => channel.name === "announcements"
        )
    ) {
        await message.delete();
        return message.reply("@everyone I'm an example command");
    }
};
//name this whatever the command name is.
module.exports.help = {
    name: "sayhi",
};
