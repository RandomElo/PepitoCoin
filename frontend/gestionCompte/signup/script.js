function dispoPseudo(pseudo) {
    return fetch(`https://eloi-site.alwaysdata.net/api/authentification/verif-pseudo/${pseudo}`,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(reponse => reponse.json())
    .then(data => {
        return data
    })
}
//Permet de récupérer le input pseudo
const pseudoForm = document.getElementById('pseudoForm')
//Permet de récupérer le paragraphe qui permet de dire si le pseudo est pas valide
const pDispoPseudo = document.getElementById('pDispoPseudo')
//Permet de récupérer le bouton d'envoie
const loginBouton = document.getElementById('loginBouton')
pseudoForm.addEventListener('keyup',async(event) => {
    var pseudoValue = event.target.value
    if(pseudoValue.length > 0) {
        var requete = await dispoPseudo(pseudoValue)
        if(requete == false) {
            loginBouton.disabled = true
            pDispoPseudo.innerText = 'Pseudo Indisponible'
        } else {
            pDispoPseudo.innerText = ''
        }
    }
})

const form = document.getElementById('form')
form.addEventListener('submit',(event)=>{
    event.preventDefault()
    //Récupération des input
    const pseudoForm = document.getElementById('pseudoForm')
    const passwordForm = document.getElementById('passwordForm')

    //Récupération des valeurs et mise en minuscule
    var pseudoValue = pseudoForm.value;
    pseudoValue = pseudoValue.toLowerCase();
    var passwordValue = passwordForm.value;
    var donneeUser = {
        'pseudo': pseudoValue,
        'password': passwordValue 
    }
    //Envoie de la requete à l'api
    fetch(`https://eloi-site.alwaysdata.net/api/authentification/signup`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donneeUser)
    })
    .then(reponse => reponse.json())
    .then(data => {
        window.location = `https://eloi-site.alwaysdata.net/accueil`
    })
})