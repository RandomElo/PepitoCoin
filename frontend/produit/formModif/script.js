//Récupération du bouton d'envoi du formulaire
var form = document.getElementById('form')
//Zone de récupération de données du formulaire
var nomForm = document.getElementById('nomForm')
var prixForm = document.getElementById('prixForm')
var descForm = document.getElementById('descForm')
var imgForm = document.getElementById('imgForm')

var adresseFichier = window.location.pathname.split('/')
var nomFichier = adresseFichier[adresseFichier.length -2]

function requeteGetOne(produitId) {
    return fetch(`${process.env.ADRESSESERVEUR}/api/pepitocoin/ressource/recuperation/${produitId}`,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(reponse => reponse.json())
    .then(data => {
        return data
    })
    .catch(error => console.error(error))
}
async function remplissageForm(produitId) {
    var requete = await requeteGetOne(produitId)
    nomForm.value = requete.nom
    prixForm.value = requete.prix
    descForm.value = requete.description
    imgForm.value = requete.image
}
remplissageForm(nomFichier)
//Création de l'événement sur le clique du bouton envoyer
form.addEventListener('submit',(event)=>{
    event.preventDefault()
    var donnneesForm = {
        'nom': nomForm.value,
        'prix': prixForm.value,
        'description': descForm.value,
        'image': imgForm.value,
    }
    //Envoie de la requete à l'api
    fetch(`${process.env.ADRESSESERVEUR}/api/pepitocoin/ressource/modification/${nomFichier}`,{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donnneesForm)
    })
    .then(reponse => reponse.json())
    .then(data => {
        console.log(data)
        window.location = `${process.env.ADRESSESERVEUR}/produit/${nomFichier}`
    })
    .catch(error => console.error(error))
})