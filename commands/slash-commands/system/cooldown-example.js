const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cooldownexample")
        .setDescription("Example command with cooldown"),

    cooldown: 10,

    async execute(interaction) {
        await interaction.reply("This command is protected by a cooldown system.");
    }
};
