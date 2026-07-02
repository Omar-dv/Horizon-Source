const {
    InteractionType
} = require("discord.js");
const logger = require("../../utils/logger");
const { handleError } = require("../../utils/errorHandler");
const cooldown = require("../../utils/cooldown");

module.exports={

    name:"interactionCreate",

    async execute(interaction,client){

        if(interaction.type !== InteractionType.ApplicationCommand)
            return;

        const command = client.slashCommands.get(interaction.commandName);

        if(!command)
            return;

        const cooldownDuration = command.cooldown || 0;

        if (cooldownDuration > 0 && cooldown.has(interaction.user.id, interaction.commandName)) {
            const remaining = cooldown.remaining(interaction.user.id, interaction.commandName);
            logger.warn(`Cooldown active for ${interaction.commandName}`, { userId: interaction.user.id, remainingSeconds: remaining });
            return interaction.reply({ content: `Please wait ${remaining} seconds before using this command again.`, ephemeral: true });
        }

        if (cooldownDuration > 0) {
            cooldown.set(interaction.user.id, interaction.commandName, cooldownDuration * 1000);
        }

        try {
            await command.execute(interaction, client);
            logger.info(`Slash command executed`, { command: interaction.commandName, userId: interaction.user.id });
        } catch (error) {
            await handleError(error, { event: "interactionCreate", command: interaction.commandName, userId: interaction.user.id });

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