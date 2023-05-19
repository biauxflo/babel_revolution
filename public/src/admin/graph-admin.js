"use strict";

/*********************************** IMPORTS ***************************************/
import { ToggleAside, AsideDiv } from "./graph-adminElements.js";
import { Message } from "./adminElements.js";

/*********************************** VARIABLES ***************************************/
// We get the last element of the adress, which is the id of the session
const idSession = document.location.href.split('/').pop();

const socket = io();

const appMessage = new Message('#application_message');
const sessionDialog = document.querySelector('dialog#session_dialog');

const aside = new ToggleAside();
const publishDecree = new AsideDiv('#publish_decree');
const endSession = new AsideDiv('#end_session');

/*********************************** TITLE REDIRECTION ***************************************/
// When the user clicks on the title, it redirects him to the admin page
document.querySelector('header button#redirectAdminPage').addEventListener('click', () => {
    console.log('+++ cliqué');
    document.location.href = '/admin';
});

/*********************************** DIALOG ***************************************/
// To close the dialog
sessionDialog.querySelector('button.close').addEventListener('click', () => {
    sessionDialog.close();
});

/*********************************** PUBLISH DECREE ***************************************/
// When the user clicks on "Promulger un décret", it updates the list of decrees
publishDecree.head.addEventListener('click', () => {
    // Send a GET request to get the list of the decrees
    fetch('/graph-admin/get-decrees')
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                publishDecree.updateSelect(res.decrees);
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Les décrets n'ont pas été récupérés.");
            console.error('Error fetching decrees : ', error);
        });

    // At the same time, we send a GET request to get the list of the example messages
    fetch('/graph-admin/get-examples')
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                const examplesDiv = publishDecree.body.querySelector('div#example_messages');
                // Delete previous content 
                examplesDiv.innerHTML = '';
                // Add the decrees to the select object
                res.examples.forEach(example => {
                    const idCheckbox = 'example_checkbox_' + example.id;
                    // Checkbox creation
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = idCheckbox;
                    checkbox.example = example;
                    // Creation to the label associated to the checkbox
                    const label = document.createElement('label');
                    label.htmlFor = idCheckbox;
                    let checkboxText = '';
                    if (example.title) {
                        checkboxText += '[ ' + example.title + ' ] ';
                    }
                    if (example.author) {
                        checkboxText += '[ ' + example.author + ' ] : ';
                    }
                    checkboxText += example.text;
                    if (example.hashtags) {
                        checkboxText += ' [ #' + example.hashtags + ' ]';
                    }
                    label.textContent = checkboxText;
                    // We add the elements to the html as children of example messages
                    examplesDiv.appendChild(checkbox);
                    examplesDiv.appendChild(label);
                });
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Les exemples n'ont pas été récupérés.");
            console.error('Error fetching examples : ', error);
        });
});

// When the user clicks on the button "Promulger le décret", the decree is published
publishDecree.submit.addEventListener('click', function () {
    // We get the selected decree and the checked examples 
    const decree = publishDecree.select.selectedOptions[0].element;
    const examples = [];
    publishDecree.body.querySelectorAll('div#example_messages input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            examples.push(checkbox.example);
        }
    });
    const data = JSON.stringify({ idSession, decree, examples });
    // We send the data to the server
    fetch('/graph-admin/publish-decree', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // We send the signal to the server, that will send it to the users
                socket.emit('decreePublished', { decree, examples });
                appMessage.showMessage("Décret promulgé.");
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la promulgation du décret.");
            console.error('Error decree publishing : ', error);
        });
});

/*********************************** END SESSION ***************************************/
// When the user clicks on the head "Terminer la session", it updates the list of decrees
endSession.head.addEventListener('click', () => {
    // We uncheck the checkbox
    endSession.body.querySelector('input#confirm_end').checked = false;
    // Send a GET request to get the list of the ends
    fetch('/graph-admin/get-ends')
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                endSession.updateSelect(res.ends);
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Les fins n'ont pas été récupérées.");
            console.error('Error fetching ends : ', error);
        });
});

// When the user clicks on the button "Terminer la session", it ends the session
endSession.submit.addEventListener('click', function () {
    // We first verify that the checkbox 'J'ai compris' is checked
    if (!endSession.body.querySelector('input#confirm_end').checked) {
        appMessage.showMessage("Vous devez cocher la case pour terminer la session");
        return;
    }
    // We get the selected end
    const end = endSession.select.selectedOptions[0].element;
    const data = new URLSearchParams({ idSession, end });
    // We send the data to the server
    fetch('/graph-admin/end-session', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // We send the signal to the server, that will send it to the users
                socket.emit('sessionCompleted', end);
                appMessage.showMessage("Session terminée.");
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la fin de la session.");
            console.error('Error session ending : ', error);
        });
});