const { Collection } = require("discord.js");

class CooldownManager {
    constructor() {
        this.cooldowns = new Collection();
    }

    set(userId, commandName, durationMs) {
        const key = `${commandName}:${userId}`;
        this.cooldowns.set(key, Date.now() + durationMs);
    }

    has(userId, commandName) {
        const key = `${commandName}:${userId}`;
        const expiresAt = this.cooldowns.get(key);

        if (!expiresAt) return false;

        if (Date.now() >= expiresAt) {
            this.cooldowns.delete(key);
            return false;
        }

        return true;
    }

    remaining(userId, commandName) {
        const key = `${commandName}:${userId}`;
        const expiresAt = this.cooldowns.get(key);

        if (!expiresAt) return 0;

        return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    }
}

module.exports = new CooldownManager();