// req = request
// res = resultat
const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const ObjectId = require('mongodb').ObjectID;
app.set('view engine', 'ejs'); // générateur de template «ejs»
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('public')) // pour utiliser le dossier public

var db // variable qui contiendra le lien sur la BD

// connection à la bdd mongo carnet qui retourne un console log de confirmation lorsque la connection est reussie
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(8081, () => {
        console.log('connexion à la BD et on écoute sur le port 8081')
    })
})

// va chercher le form de la collection adresse et affiche le contenu de la bdd
app.get('/', (req, res) => {
    console.log('la route route get / = ' + req.url)

    var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
        if (err) return console.log(err)
        // renders index.ejs
        // affiche le contenu de la BD
        res.render('index_tp2.ejs', {
            adresse: resultat
        })
    })
})

// va chercher le form de la collection adresse et enregistre le contenu de la bdd qui redirrige a l'affichage
app.post('/adresse', (req, res) => {
    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/')
    })
})


app.get('/detruire/:_id', (req, res) => {

    db.collection('adresse').findOneAndDelete({
        _id: ObjectId(req.params._id)
    }, (err, resultat) => {

        if (err) return res.send(500, err)
        var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
            if (err) return console.log(err)
            // renders index.ejs
            // affiche le contenu de la BD
            res.redirect('/');
        })
    })
})

app.get('/modifier', (req, res) => {

    //var nom = document.getElementById("nom").value;

    var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
        if (err) return console.log(err)
        // renders index.ejs
        // affiche le contenu de la BD
        console.log(req.url.slice(-1));
        res.redirect('/');
        //res.render('index1.ejs', {adresse: resultat, id:req.url.slice(-1)})
    })
})

app.post('/enregistrer', (req, res) => {

    db.collection('adresse').update({
        _id: ObjectId(req.body._id)
    }, {
        $set: {
            'nom': req.body.nom,
            'prenom': req.body.prenom,
            'telephone': req.body.telephone,
            'ville': req.body.ville,
            'codepostal': req.body.codepostal
        }
    }, (err, resultat) => {

        if (err) return res.send(500, err)
        var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
            if (err) return console.log(err)
            // renders index.ejs
            // affiche le contenu de la BD
            //res.render('index.ejs', {adresse: resultat})
            res.redirect('/');
        })
    })
})