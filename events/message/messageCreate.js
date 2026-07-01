const config = require("../../database/setup-files/config.json");

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

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing prefix command ${commandName}:`, error);
            await message.reply("There was an error while executing that command.");
        }

    }

}