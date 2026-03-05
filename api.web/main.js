// fonction asynchrone pour récupérer les données d'une api
const container = document.querySelector(".container");

async function getData(number) {
    
    // on déclare le endpoint de l'api avec un paramètre
    const url = `https://meowfacts.herokuapp.com/?count=${number}`;

    // bloc try catch pour gérer les erreurs
    try {
        // on invoque fetch pour faire une requête sur l'api
        const reponse = await fetch(url);

        // si ok on parse le json
        if (!reponse.ok) {
        throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();
        

        resultat.data.forEach(element => {
            container.innerHTML += `<div class="item">${element}</div>`;
        });


    } catch (erreur) {
        console.error(erreur.message);
    }
}

function ready() {
    const button = document.getElementById("btn");
    const number = document.getElementById("number");
    const reset = document.getElementById("reset");

    button.addEventListener("click", function(e) {        
        getData(number.value);
    });


    reset.addEventListener("click", function(e) {
        container.innerHTML = "";
    });

}


document.addEventListener("DOMContentLoaded", ready());