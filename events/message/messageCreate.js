const config = require("../../database/setup-files/config.json");
const logger = require("../../utils/logger");
const { handleError } = require("../../utils/errorHandler");
const cooldown = require("../../utils/cooldown");

module.exports = {

    name:"messageCreate",

    async execute(message, client){

        if(message.author.bot) return;

        const prefix = config.prefix || "!";

        if(!message.content.startsWith(prefix))
            return;

        const args = message.content.slice(prefix.length).trim().split(/\s+/).filter(Boolean);
        const commandName = args.shift()?.toLowerCase();

        if(!commandName)
            return;

        const command = client.prefixCommands.get(commandName);

        if(!command)
            return;

        const cooldownDuration = command.cooldown || 0;

        if (cooldownDuration > 0 && cooldown.has(message.author.id, commandName)) {
            const remaining = cooldown.remaining(message.author.id, commandName);
            logger.warn(`Cooldown active for ${commandName}`, { userId: message.author.id, remainingSeconds: remaining });
            return message.reply(`Please wait ${remaining} seconds before using this command again.`);
        }

        if (cooldownDuration > 0) {
            cooldown.set(message.author.id, commandName, cooldownDuration * 1000);
        }

        try {
            await command.execute(message, args, client);
            logger.info(`Prefix command executed`, { command: commandName, userId: message.author.id });
        } catch (error) {
            await handleError(error, { event: "messageCreate", command: commandName, userId: message.author.id });
            await message.reply("There was an error while executing that command.");
        }

    }

}