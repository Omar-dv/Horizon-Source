const {
    InteractionType
} = require("discord.js");

module.exports={

    name:"interactionCreate",

    async execute(interaction,client){

        if(interaction.type !== InteractionType.ApplicationCommand)
            return;

        const command = client.slashCommands.get(interaction.commandName);

        if(!command)
            return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error executing slash command ${interaction.commandName}:`, error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command.",
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command.",
                    ephemeral: true
                });
            }
        }

    }

}