//Zone dont je ne peut pas m'occuper
var produitAll = document.querySelectorAll(".AEproduitAff");
produitAll.forEach((produit) => {
    produit.addEventListener("click", () => {
        var idProduit = produit.id;
        window.location = `${process.env.ADRESSESERVEUR}${process.env.PORT}/produit/${idProduit}`;
    });
});