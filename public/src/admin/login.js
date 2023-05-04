"use strict";

const connexionForm = document.querySelector("form#connexion_form");
const connexionMessage = connexionForm.querySelector("#connexion_message");
connexionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formInfo = new FormData(connexionForm);
    const data = new URLSearchParams(formInfo);
    fetch('/login', {
        method: 'post',
        body: data
    })
        .then(response => {
            switch (response.status) {
                case 302:
                    connexionMessage.textContent = "";
                    break;

                case 401:
                    connexionMessage.textContent = "Identifiant ou mot de passe incorrect.";
                    break;

                case 500:
                    connexionMessage.textContent = "Erreur du serveur lors de l'authentification.";
                    throw new Error(`status: ${response.status}, response: ${JSON.stringify(response.json)}`);

                default:
                    connexionMessage.textContent = "Erreur.";
                    throw new Error(`status: ${response.status}, response: ${JSON.stringify(response.json)}`);
            }
            return response.json();
        })
        .then(res => {
            // Si l'utilisateur a bien été identifié, on le redirige vers la page admin
            if (res.success) {
                window.location.replace(res.redirectUrl);
            }
        })
        .catch(error => {
            console.error('Error during the authentification. ', error);
        });
});