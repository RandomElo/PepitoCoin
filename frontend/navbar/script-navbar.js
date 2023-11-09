// Permet de gérer le clique sur l'image hambirger
var menuHamburger = document.querySelector(".menuHamburger");
var navLinks = document.querySelector(".navLinks");
menuHamburger.addEventListener("click", () => {
    navLinks.classList.toggle("mobileMenu");
});

//Zone de gestion du sous menus
//Récupération de l'élément à surveiller
var conteneurSousListe = document.querySelector(".conteneurSousListe");
var sousListe = document.querySelector(".sousListe");
if (conteneurSousListe != null) {
    conteneurSousListe.addEventListener("click", () => {
        if (sousListe.style.display === "none") {
            sousListe.style.display = "block";
        } else {
            sousListe.style.display = "none";
        }
    });
}
//Zone de gestion de deconnexion
var lienDeconnexion = document.getElementById("lienDeconnexion");
if (lienDeconnexion != null) {
    lienDeconnexion.addEventListener("click", () => {
        var confirmation = confirm("Étés vous sur vouloir, vous déconnecter ?");
        if (confirmation) {
            fetch(`http://eloi-site.alwaysdata.net/api/authentification/deconnexion`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(() => {
                    window.location = `http://eloi-site.alwaysdata.net/accueil`;
                })
                .catch((error) => console.error(error));
        }
    });
}
//Zone de gestion de suppression du compte
var lienSuppression = document.getElementById("lienSuppression");
if (lienSuppression != null) {
    lienSuppression.addEventListener("click", () => {
        var confirmation = confirm("Étés vous sur, vouloir, vous supprimer votre compte ?");
        if (confirmation) {
            fetch(`http://eloi-site.alwaysdata.net/api/authentification/suppression`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(() => {
                    window.location = `http://eloi-site.alwaysdata.net/accueil`;
                })
                .catch((error) => console.error(error));
        }
    });
}
