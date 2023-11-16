const http = require("http");
// //Imporation du package app
const app = require("./app");

const server = http.createServer(app);
const errorHandler = (error) => {
    //Si l'erreur n'est pas strictement égale à listen alors elle est jeter
    if (error.syscall !== "listen") {
        throw error;
    }
    //Permet de récupérer l'adresse du serveur
    const address = server.address();
    //Variable crée en fonction du type d'adresse | Si address est chaine de caractère elle est préfixer par pipe, sinon elle est préfixer par port suivit du numéro de port
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port;

    switch (error.code) {
        //Si jamais le code d'erreur est 'EACCES' alors le msg d'erreur dit que ont a pas de privilège assez élever
        case "EACCES":
            console.error(bind + " requires elevated privileges.");
            //Arrête l'exécution de l'application Node.js avec '1' comme argument | '1' est un code de sortie qui signifie que cela c'est mal terminer
            process.exit(1);
            //Arrêt du proccessus
            break;
        //Si le code d'erreur est 'EADDRINUSE', cela signifie que le port est déjà utilisé
        case "EADDRINUSE":
            console.error(bind + " is already in use.");
            process.exit(1);
            //Arrêt du proccessus
            break;
        //Par défault
        default:
            //Signale l'erreur et termine l'exécution
            throw error;
    }
};
server.on("error", errorHandler);
server.on("listening", () => {
    console.log("Serveur démarré");
});
