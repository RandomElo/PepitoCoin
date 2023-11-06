// //Imporation du package http
// const http = require("http");
// //Imporation du package app
// const app = require("./app");

// //Normalisation de port
// const normalizePort = (val) => {
//     //Convertit le port en un nombre entier
//     const port = parseInt(val, 10); //10 permet d'indiquer la base numérique à utiliser pour la convertion

//     //Si c'est un nombre alors retourner la valeur telle quelle
//     if (isNaN(port)) {
//         return val;
//     }
//     //Si c'est un nombre positif alors le nombre est retourner
//     if (port >= 0) {
//         return port;
//     }
//     //Dans les autres cas retourne false
//     return false;
// };
// //Dans un premier temps défini le numéro de port, puis l'envoie dans normalizePort, pour vérifier que la valeur est valide
// const port = normalizePort(process.env.PORT || "3000");
// //Configure le numéro de port de l'application Express
// app.set("port", port);

// //Fonction qui gère les erreurs lié à l'écoute du serveur
// const errorHandler = (error) => {
//     //Si l'erreur n'est pas strictement égale à listen alors elle est jeter
//     if (error.syscall !== "listen") {
//         throw error;
//     }
//     //Permet de récupérer l'adresse du serveur
//     const address = server.address();
//     //Variable crée en fonction du type d'adresse | Si address est chaine de caractère elle est préfixer par pipe, sinon elle est préfixer par port suivit du numéro de port
//     const bind = typeof address === "string" ? "pipe " + address : "port: " + port;

//     switch (error.code) {
//         //Si jamais le code d'erreur est 'EACCES' alors le msg d'erreur dit que ont a pas de privilège assez élever
//         case "EACCES":
//             console.error(bind + " requires elevated privileges.");
//             //Arrête l'exécution de l'application Node.js avec '1' comme argument | '1' est un code de sortie qui signifie que cela c'est mal terminer
//             process.exit(1);
//             //Arrêt du proccessus
//             break;
//         //Si le code d'erreur est 'EADDRINUSE', cela signifie que le port est déjà utilisé
//         case "EADDRINUSE":
//             console.error(bind + " is already in use.");
//             process.exit(1);
//             //Arrêt du proccessus
//             break;
//         //Par défault
//         default:
//             //Signale l'erreur et termine l'exécution
//             throw error;
//     }
// };
// //Créer le serveur avec l'application 'app' Express
// const server = http.createServer(app);
// //On rattache le gestionnaire d'erreur qui à étais définis plutot
// server.on("error", errorHandler);
// server.on("listening", () => {
//     //Récupère l'addresse du serveur
//     const address = server.address();
//     //Variable crée en fonction du type d'adresse | Si address est chaine de caractère elle est préfixer par pipe, sinon elle est préfixer par port suivit du numéro de port
//     const bind = typeof address === "string" ? "pipe " + address : "port " + port;
//     //Affiche dans la console du navigateur le port qui est utiliser
//     console.log("Listening on " + bind);
// });
// //Configure le port que doit écouter le serveur - selon la valeur qui à étais défini plutôt
// server.listen(port);

const http = require('http');

const ip = 'fd00::5:c63';
const port = 8100;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bienvenue sur votre serveur HTTP !');
});

server.listen(port, ip, () => {
  console.log(`Le serveur écoute à l'adresse IP: ${ip}, sur le port: ${port}`);
});
