"use strict";

/*********************************** IMPORTS ***************************************/
import { ToggleAside, AsideDiv } from "./graph-adminElements.js";
import { Message } from "./adminElements.js";

/*********************************** VARIABLES ***************************************/
// We get the last element of the adress, which is the id of the session
const idSession = document.location.href.split('/').pop().split('?').shift();

const socket = io();

const appMessage = new Message('#application_message');
const sessionDialog = document.querySelector('dialog#session_dialog');

const aside = new ToggleAside();
aside.addDivListeners();

const publishDecree = new AsideDiv('#publish_decree');
const endSession = new AsideDiv('#end_session');
const writeMessage = new AsideDiv('#write_message');
const modifyMessage = new AsideDiv('#modify_message');

/*********************************** TITLE REDIRECTION ***************************************/
// When the user clicks on the title, it redirects him to the admin page
document.querySelector('header button#redirectAdminPage').addEventListener('click', () => {
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

/*********************************** CMC MESSAGE ***************************************/
// When the user clicks on the head "Terminer la session", it updates the list of decrees
writeMessage.head.addEventListener('click', () => {
    // Send a GET request to get the list of the decree published in this session
    fetch('/graph-admin/get-session-decrees/' + idSession)
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                writeMessage.updateSelect(res.decrees);
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Les décrets n'ont pas été récupérées.");
            console.error('Error fetching published decrees : ', error);
        });
});

// When the user clicks on the button "Publier le message", it publishes the message
const messageForm = writeMessage.body.querySelector("#CMC_message_form");
messageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new URLSearchParams(new FormData(messageForm));
    // We add to the data the id of the current session
    data.append('idSession', idSession);
    fetch('/graph-admin/cmc-message', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // We send the signal to the server, that will send it to the users
                socket.emit('databaseUpdate');
                appMessage.showMessage("Message publié.");
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la publication du message.");
            console.error('Error message publishing : ', error);
        });
});

/*********************************** MODIFY MESSAGE ***************************************/
// When the user clicks on the head "Modifier une contribution", it unchecks the checkbox that enable to delete a message
modifyMessage.head.addEventListener('click', () => {
    // We uncheck the checkbox that enable to delete a message
    endSession.body.querySelector('input#confirm_delete').checked = false;
});

// List of inputs of modify message form
const modifiedMessageForm = modifyMessage.body.querySelector("form");
const modifyMessageInputs = Array.from(modifiedMessageForm.querySelectorAll("label > input[type='text']"));
modifyMessageInputs.push(modifiedMessageForm.querySelector("label > textarea"));

// When the user clicks on the checkbox "Activer la modification", it enable or disables the inputs
const modifyCheckbox = modifyMessage.body.querySelector("#able_modification");
modifyCheckbox.addEventListener('change', () => {
    modifyMessageInputs.forEach(input => {
        input.disabled = !modifyCheckbox.checked;
    });
});

// When the user clicks on the button "Modifier la contribution", it changes the contribution in the db
modifiedMessageForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new URLSearchParams(new FormData(modifiedMessageForm));
    // We add to the data the id of the current session
    data.append('idSession', idSession);
    fetch('/graph-admin/modify-message', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // We send the signal to the server, that will send it to the users
                socket.emit('databaseUpdate');
                appMessage.showMessage("Message modifié.");
                // We uncheck the modification checkbox
                modifyCheckbox.checked = false;
                modifyMessageInputs.forEach(input => {
                    input.disabled = true;
                });
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la modification du message.");
            console.error('Error message modification : ', error);
        });
});

// When the user clicks on the button "Supprimer la contribution", it deletes the contribution
const deleteCheckbox = modifyMessage.body.querySelector('input#confirm_delete');
modifyMessage.body.querySelector('#delete_contribution_button').addEventListener('click', function () {
    // We first verify that the checkbox 'J'ai compris' is checked
    if (!deleteCheckbox.checked) {
        appMessage.showMessage("Vous devez cocher la case pour supprimer la contribution");
        return;
    }
    // Then we verify that it's not a decree, which cannot be deleted
    if (modifiedMessageForm.querySelector('#node_type').value === 'decree') {
        appMessage.showError("Un décret ne peut pas être supprimé");
        return;
    }
    // We get the selected contribution id
    const idMessage = modifiedMessageForm.querySelector('#node_id').value;
    const data = new URLSearchParams({ idSession, idMessage });
    // We send the data to the server
    fetch('/graph-admin/delete-message', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // We send the signal to the server, that will send it to the users
                socket.emit('databaseUpdate');
                appMessage.showMessage("Message supprimé.");
                // We reset the inputs values and the delete checkbox
                deleteCheckbox.checked = false;
                modifyMessageInputs.forEach(input => {
                    input.value = null;
                });
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la suppression de la contribution.");
            console.error('Error message deletion : ', error);
        });
});