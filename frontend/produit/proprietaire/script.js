// supprProduit
var supprProduit = document.getElementById("supprProduit");
supprProduit.addEventListener("click", () => {
    var confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmation) {
        fetch(`${process.env.IP}${process.env.PORT}/api/pepitocoin/ressource/suppression/${nomFichier}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                console.log(data);
                window.location = `${process.env.IP}${process.env.PORT}/accueil`;
            })
            .catch((error) => console.error(error));
    }
});