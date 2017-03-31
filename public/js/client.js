function ajout() {
    document.getElementById('tableau').innerHTML += '<div class="table-row">' +
        '<div class="text modifiable" value="" contentEditable="true"> </div>' +
        '<div class="text modifiable" value="" contentEditable="true"></div>' +
        '<div class="text modifiable" value="" contentEditable="true"></div>' +
        '<div class="text" value=""></div>' +
        '<i class="num fa fa-floppy-o" aria-hidden="true" onclick="verifierEnregistrement(this)"></i>' +
        '<i class="num fa fa-trash-o" aria-hidden="true" onclick="detruire(this)"></i>' +
        '</div>';
}

function verifierEnregistrement(element) {
    if (element.parentElement.children[3].innerHTML)
        mofidier(element);
    else
        ajouter(element);
}

var xhr, data;

function ajouter(element) {

    xhr = new XMLHttpRequest();
    xhr.open('POST', "ajouter", true);
    data = {
        "ajouter": {
            "nom": element.parentElement.children[0].innerHTML,
            "prenom": element.parentElement.children[1].innerHTML,
            "telephone": element.parentElement.children[2].innerHTML
        }
    };
    var sData = JSON.stringify(data);
    xhr.setRequestHeader('Content-type', 'application/json');
    console.log(sData);
    xhr.send(sData);
    xhr.addEventListener("readystatechange", traiterRequest, false);
}

function mofidier(element) {

    xhr = new XMLHttpRequest();
    xhr.open('POST', "modifier", true);
    data = {
        "modifier": {
            "nom": element.parentElement.children[0].innerHTML,
            "prenom": element.parentElement.children[1].innerHTML,
            "telephone": element.parentElement.children[2].innerHTML
        },
        "_id": element.parentElement.children[3].innerHTML
    };
    var sData = JSON.stringify(data);
    xhr.setRequestHeader('Content-type', 'application/json');
    console.log(sData);
    xhr.send(sData);
    xhr.addEventListener("readystatechange", traiterRequest, false);
}

//Fonction pour détruire un élément, même s'il n'est pas enregistrer
function detruire(element) {

    var xhr = new XMLHttpRequest();

    //Vérifier si l'élément a un id - s'il n'en a pas, on ôte l'élément
    if (!element.parentElement.children[3].innerHTML) {
        element.parentElement.parentElement.removeChild(element.parentElement);
        return;
    }

    //Si oui, on donne la route pour détruire l'élément (tp2.js)
    xhr.open('POST', "detruire/" + element.parentElement.children[3].innerHTML, true);
    xhr.send();
    xhr.addEventListener("readystatechange", traiterRequest, false);
}

function traiterRequest(e) {

    console.log("xhr.readyState = " + xhr.readyState)
    console.log("xhr.status = " + xhr.status)
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('ajax fonctionne')
        var response = JSON.parse(xhr.responseText);
        console.log(xhr.responseText);
        elmChamp_id.innerHTML = response[0]._id
        elmLigne.style.backgroundColor = "#0f0"
    }
}