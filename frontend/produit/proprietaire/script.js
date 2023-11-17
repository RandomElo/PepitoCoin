//Récupération de l'id de la page
var idProduit = window.location.href;
idProduit = idProduit.split("/")
idProduit = idProduit[idProduit.length -2]
console.log(idProduit);
var supprProduit = document.getElementById("supprProduit");
supprProduit.addEventListener("click", () => {
    var confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmation) {
        fetch(`http://eloi-site.alwaysdata.net/api/pepitocoin/ressource/suppression/${idProduit}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                window.location = `http://eloi-site.alwaysdata.net/accueil`;
            })
            .catch((error) => console.error(error));
    }
});
