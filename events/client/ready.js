const logger = require("../../utils/logger");

module.exports = {

    name:"ready",
    once:true,

    execute(client){

        logger.success(`Logged in as ${client.user.tag}`);

    }

}