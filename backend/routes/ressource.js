const express = require('express')
const multer = require('../middleware/multer')
const resCtrl = require('../controllers/ressource')

const router = express.Router();

router.get('/recuperation', resCtrl.recupAllRes)

router.get('/recuperation/:id', resCtrl.recupOneRes)

router.post('/publication', multer, resCtrl.publiRes)

router.put('/modification/:id', resCtrl.modifRes)

router.delete('/suppression/:id', resCtrl.supprRes)


module.exports = router;