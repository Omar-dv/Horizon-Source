require("dotenv").config({
    path:"./database/setup-files/.env"
});

const fs=require("fs");
const path=require("path");

const {
    REST,
    Routes
}=require("discord.js");

if (!process.env.TOKEN || !process.env.CLIENT_ID) {
    throw new Error("Missing TOKEN or CLIENT_ID in database/setup-files/.env");
}

const commands=[];

const base=path.join(process.cwd(),"commands/slash-commands");

const folders=fs.readdirSync(base);

for(const folder of folders){

    const files=fs.readdirSync(`${base}/${folder}`)
    .filter(file=>file.endsWith(".js"));

    for(const file of files){

        const command=require(`${base}/${folder}/${file}`);

        commands.push(command.data.toJSON());

    }

}

const rest=new REST({
    version:"10"
}).setToken(process.env.TOKEN);

(async()=>{

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        {body:commands}
    );

    console.log("Slash Commands Deployed.");

})();