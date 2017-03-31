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

var classementNom = 1;
app.get('/classer',  (req, res, next) => {

  var cursor = db.collection('adresse').find().sort({nom:classementNom}).toArray(function(err, resultat) {
        if (err) return console.log(err)
        res.render('index_tp2.ejs', {
            adresse: resultat
        })
        classementNom = -classementNom;
    })
});

app.post('/ajouter',  (req, res, next) => {

  console.log(req.body);

  db.collection('adresse').insertOne({
    "nom" : req.body.ajouter.nom,
    "prenom" : req.body.ajouter.prenom,
    "telephone": req.body.ajouter.telephone 
  }, (err, resultat) => {

        if (err) return res.send(500, err)
        var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
            if (err) return console.log(err)
            console.log("err");
        })
    })
});

app.post('/modifier',  (req, res, next) => {

  db.collection('adresse').update({
        _id: ObjectId(req.body._id)
    }, {
        $set: {
            "nom": req.body.modifier.nom, 
            "prenom": req.body.modifier.prenom, 
            "telephone": req.body.modifier.telephone
        }
    }, (err, resultat) => {

        if (err) return res.send(500, err)
        var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
            if (err) return console.log(err)
            console.log("err");
        })
    })
});

app.post('/detruire/:_id', (req, res) => {

    db.collection('adresse').findOneAndDelete({
        _id: ObjectId(req.params._id)
    }, (err, resultat) => {
        res.redirect('/');
    })
})
