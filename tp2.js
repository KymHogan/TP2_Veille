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
var db;

//Connection à la base de données
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(8081, () => {
        console.log('connexion à la BD et on écoute sur le port 8081')
    })
})

//Lorsque l'url est vide, on affiche le contenu de la base de données
app.get('/', (req, res) => {
    var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
        if (err) return console.log(err)
        res.render('index.ejs', {
            adresse: resultat
        })
    })
})

//Lorsqu'on clique sur le nom, on classe les éléments selon un ordre ascendant ou descendant
var classementNom = 1;
app.get('/classer',  (req, res, next) => {
  var cursor = db.collection('adresse').find().sort({nom:classementNom}).toArray(function(err, resultat) {
        if (err) return console.log(err)
        res.render('index.ejs', {
            adresse: resultat
        })
        classementNom = -classementNom;
    })
});

//Appelé du script client.js - Ajoute un élément à la collection avec l'information envoyée (innerHTML)
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

//Appelé du script client.js - Modifie un élément à la collection avec l'information envoyée (innerHTML)
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

//Appelé du script client.js - Détruit un éléments à la collection en fonction de son id
app.post('/detruire/:_id', (req, res) => {
    db.collection('adresse').findOneAndDelete({
        _id: ObjectId(req.params._id)
    }, (err, resultat) => {
        res.redirect('/');
    })
})
