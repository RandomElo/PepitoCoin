function login(donnees) {
    return fetch(`${process.env.ADRESSESERVEUR}${process.env.PORT}/api/authentification/login`,{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(donnees)
    })
    .then(reponse => reponse.json())
    .then(data => {
        return data
    })

}
const form = document.getElementById('form')
form.addEventListener('submit',async(event)=>{
    event.preventDefault()
    //Récupération des inputs
    var pseudoForm = document.getElementById('pseudoForm')
    var pseudoValue = pseudoForm.value
    var passwordForm = document.getElementById('passwordForm')
    var passwordValue = passwordForm.value
    //Mise en forme pour l'envoie de l'API
    var donneesLogin = {
        'pseudo':pseudoValue,
        'password': passwordValue
    }
    console.log(pseudoValue, passwordValue)
    var requete = await login(donneesLogin)
    if(requete == true) {
        window.location = `${process.env.ADRESSESERVEUR}${process.env.PORT}/accueil`
    } else {
        //Cela veut dire que les identifiants sont incorrect
        const loginErreur = document.getElementById('loginErreur')
        loginErreur.innerText = 'Identifiant ou mot de passe incorrect'

    }
    console.log(requete)
})