require("dotenv").config({
    path: "./database/setup-files/.env"
});

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const token = process.env.TOKEN;

if (!token) {
    throw new Error("Missing TOKEN in database/setup-files/.env");
}

const client = new Client({
    intents: Object.values(GatewayIntentBits)
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

require("./utils/handlers/eventHandler")(client);
require("./utils/handlers/slashHandler")(client);
require("./utils/handlers/prefixHandler")(client);

client.login(token);