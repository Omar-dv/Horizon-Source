const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    const base = path.join(process.cwd(), "commands/slash-commands");

    const folders = fs.readdirSync(base);

    for (const folder of folders) {

        const files = fs.readdirSync(`${base}/${folder}`)
            .filter(file => file.endsWith(".js"));

        for (const file of files) {

            const command = require(`${base}/${folder}/${file}`);

            client.slashCommands.set(command.data.name, command);

        }

    }

};