const Discord = require("discord.js");
const config = require("../config.json");
const colours = require("../colours.json");
const prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
    if (
        message.member.roles.some((role) => role.name === "Moderator") ||
        message.channel === "bot-commands"
    ) {
        if (args[0] == "help")
            return message.channel.send(`Just do ${prefix}help instead.`);

        if (args[0]) {
            let command = args[0];
            if (bot.commands.has(command)) {
                command = bot.commands.get(command);
                var SHembed = new Discord.RichEmbed()
                    .setColor(colours.cyan)
                    .setAuthor(`Zen Bot Help`, message.guild.iconURL)
                    .setThumbnail(bot.user.displayAvatarURL)
                    .setDescription(
                        `The bot prefix is: ${prefix}\n\n**Command:** ${
                            command.help.name
                        }\n**Description:** ${
                            command.help.description || "No Description"
                        }\n**Usage:** ${command.help.usage || "No Usage"}`
                    );
                message.channel.send(SHembed);
            }
        }

        if (!args[0]) {
            message.delete();
            let Sembed = new Discord.RichEmbed()
                .setColor(colours.cyan)
                .setAuthor(`Zen Bot Help`, message.guild.iconURL)
                .setThumbnail(bot.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(
                    `These are the avaliable commands.\nThe bot prefix is: ${prefix}`
                )
                .addField(
                    `Commands:`,
                    "``ban`` ``unban`` ``kick`` ``mute`` ``supermute`` ``unmute`` ``purge``"
                )
                .addField(
                    `Type ${prefix}help <command> to check details of a command.`
                )
                .setFooter("Zen Bot", bot.user.displayAvatarURL);

            message.channel.send(Sembed);
        }
    }
};
//name this whatever the command name is.
module.exports.help = {
    name: "help",
};
