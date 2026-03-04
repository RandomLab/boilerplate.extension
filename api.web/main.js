// fonction asynchrone pour récupérer les données d'une api
async function getData() {
    
    // on déclare le endpoint de l'api avec un paramètre
    const url = "https://meowfacts.herokuapp.com/?count=10";
    const container = document.querySelector(".container");

    console.log(container)

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
    getData()
}


document.addEventListener("DOMContentLoaded", ready());