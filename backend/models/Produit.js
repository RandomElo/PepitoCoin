const mongoose = require('mongoose')

const produitSchema = mongoose.Schema({
    nom: {type:String, required:true},
    userID:{type:String, required:true},
    prix: {type:Number, required:true},
    description: {type:String, required:true},
    image: {type:String, required:true}
})

//On transforme le schéma en modèle et on l'importe
module.exports = mongoose.model('Produit',produitSchema)