"use strict";

/*********************************** IMPORTS ***************************************/
import { Message, SessionGlass, Prompt, GlassBase, PromptWithCancel } from "./adminElements.js";
import { addSessionHTML, createSession } from "./sessionCreation.js";

/*********************************** VARIABLES ***************************************/
const appMessage = new Message('#application_message');
const menu = new GlassBase('aside');

const sessionTemplate = document.querySelector("div#session_template");

const ongoingSessionsSet = document.querySelector("#ongoing_sessions_set");
const createSessionDiv = ongoingSessionsSet.querySelector("#create_session");
const visibleSessionsSet = document.querySelector("#visible_completed_sessions_set");
const nonVisibleSessionsSet = document.querySelector("#non_visible_completed_sessions_set");

const sessionActionsGlass = new SessionGlass('#session_actions_glass');

const sessionNamePrompt = new Prompt('#session_name_prompt');
const sessionRenamePrompt = new Prompt('#session_rename_prompt');
const sessionDeletePrompt = new PromptWithCancel('#session_delete_prompt');
const accountCreatePrompt = new PromptWithCancel('#account_create_prompt');
const accountDeletePrompt = new PromptWithCancel('#account_delete_prompt');
const passwordChangePrompt = new PromptWithCancel('#password_change_prompt');

/*********************************** AT PAGE LOAD ***************************************/
// Get the sessions and update the page depending on the admin level of the current user
document.addEventListener("DOMContentLoaded", function () {
    // Get all the sessions that the current user is allowed to see and display them
    fetch('/admin/get-sessions', {
        method: 'get',
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // Create the HTML element for each session
                res.sessions.forEach(session => {
                    addSessionHTML(sessionTemplate, session, sessionActionsGlass, ongoingSessionsSet, createSessionDiv,
                        visibleSessionsSet, nonVisibleSessionsSet, sessionRenamePrompt, sessionDeletePrompt, appMessage);
                });
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            console.error('Error getting sessions : ', error);
            appMessage.showError('Erreur lors de la récupération des sessions.', 8000);
        });

    // Get the current user admin level, and update the html if needed
    fetch('/admin/admin-level', {
        method: 'get',
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                switch (res.privileges) {
                    case 0:
                        break;

                    case 1:
                        accountCreatePrompt.element.querySelector("#privilege_1_radio").remove();
                        accountCreatePrompt.element.querySelector("#privilege_1_radio_label").remove();
                        break;

                    default:
                        // For privileges === '2' (shall not be something else)
                        menu.element.querySelector("button#create_account").remove();
                        menu.element.querySelector("button#delete_account").remove();
                        break;
                }
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            // Same thing that for admin level 2 by default
            menu.element.querySelector("button#create_account").remove();
            menu.element.querySelector("button#delete_account").remove();
            // And messages
            console.error('Error getting current admin level : ', error);
            appMessage.showError(
                'Erreur lors de la récupération du niveau admin, certaines fonctionnalités peuvent être indisponibles', 15000);
        });
});

/*********************************** PROMPTS ***************************************/
// Prompt to enter the name of a new session
sessionNamePrompt.prompt.querySelector("button.create").addEventListener('click', function () {
    const name = sessionNamePrompt.prompt.querySelector("input").value;
    createSession(sessionTemplate, name, sessionActionsGlass, ongoingSessionsSet, createSessionDiv,
        visibleSessionsSet, nonVisibleSessionsSet, sessionRenamePrompt, sessionDeletePrompt, appMessage);
    sessionNamePrompt.hide();
});

// Prompt to change the name of a new session
sessionRenamePrompt.prompt.querySelector("button.rename").addEventListener('click', function () {
    const newTitle = sessionRenamePrompt.prompt.querySelector("input").value;
    const id = sessionRenamePrompt.associated.id;
    const data = new URLSearchParams({ id, newTitle });
    fetch('/admin/rename-session', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                sessionRenamePrompt.associated.querySelector('.session_title').textContent = newTitle;
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors du changement de nom de la session.");
            console.error('Error renaming session : ', error);
        });
    sessionRenamePrompt.hide();
});

// Prompt to confirm or cancel the deletion of a session
sessionDeletePrompt.prompt.querySelector("button.delete").addEventListener('click', function () {
    const id = sessionDeletePrompt.associated.id;
    const data = new URLSearchParams({ id });
    fetch('/admin/delete-session', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                sessionDeletePrompt.associated.remove();
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors de la suppression de la session.");
            console.error('Error deleting session : ', error);
        });
    sessionDeletePrompt.hide();
});

/*********************************** SESSION CREATION ***************************************/
// When the user click on the '+' session, it shows the prompt to enter the name of the new session
createSessionDiv.addEventListener('click', function () {
    sessionNamePrompt.show();
    // On this prompt, when the user will click on "Créer", it will call the function createSession() 
});

/*********************************** MENU ***************************************/
// When the user clicks on the 'Menu' button, the menu appears
document.querySelector('#menu_button').addEventListener('click', function () {
    menu.show();
});

// When the user clicks on another place than on the menu, the menu disappeared
document.querySelector('#menu_hiding_glass').addEventListener('click', function () {
    menu.hide();
});

/*********************************** CREATE ACCOUNT ***************************************/
// When the user select the privileges level, it shows the correspondant accesses
const privileges1Radio = accountCreatePrompt.element.querySelector('input#privilege_1_radio');
const privileges2Radio = accountCreatePrompt.element.querySelector('input#privilege_2_radio');
const privileges1List = accountCreatePrompt.element.querySelector('#privileges_1');
const privileges2List = accountCreatePrompt.element.querySelector('#privileges_2');
function updatePrivilegeText() {
    if (privileges1Radio.checked) {
        privileges1List.style.zIndex = "30";
        privileges2List.style.zIndex = "-30";
    } else if (privileges2Radio.checked) {
        privileges1List.style.zIndex = "-30";
        privileges2List.style.zIndex = "30";
    } else {
        privileges1List.style.zIndex = "-30";
        privileges2List.style.zIndex = "-30";
    }
}
privileges1Radio.addEventListener('click', updatePrivilegeText);
privileges2Radio.addEventListener('click', updatePrivilegeText);

const createAccountMessage = accountCreatePrompt.element.querySelector("#create_account_message");

// When the user clicks on the button "Créer un compte", it shows the prompt
menu.element.querySelector('button#create_account').addEventListener('click', function () {
    menu.hide();
    updatePrivilegeText();
    // We reset the error message
    createAccountMessage.textContent = "";
    accountCreatePrompt.show();
});

// This function is called when the user clicks on the submit button of the account create prompt
function sendAccountCreationData(formInfo) {
    // We reset the message, then we send the data
    createAccountMessage.textContent = "";
    const data = new URLSearchParams(formInfo);
    fetch('admin/create-account', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                appMessage.showMessage("Le compte a été créé.");
                accountCreatePrompt.hide();
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            createAccountMessage.textContent = "Erreur serveur lors de la création du compte.";
            console.error('Error creating the account : ', error);
        });
}

const createAccountForm = accountCreatePrompt.element.querySelector("#create_account_form");
createAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formInfo = new FormData(createAccountForm);
    // We check the info from the form
    if (formInfo.get('username').length < 1) {
        createAccountMessage.textContent = "Le nom d'utilisateur ne peut pas être nul.";

    } else if (formInfo.get('password').length < 5) {
        createAccountMessage.textContent = "Le mot de passe doit avoir 5 caractères ou plus.";

    } else if (formInfo.get('password') !== formInfo.get('password_verification')) {
        createAccountMessage.textContent = "Les mots de passe doivent correspondre.";

    } else if (formInfo.get('privilege') !== '1' && formInfo.get('privilege') !== '2') {
        createAccountMessage.textContent = "Le niveau admin doit être 1 ou 2.";

    } else {
        // If everything until now is ok, we now check if the username is already taken
        fetch('admin/all-accounts-list')
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    // We check for the elements in res.users if the username is already included
                    if (res.users.some(element => element.username === formInfo.get('username'))) {
                        createAccountMessage.textContent = "Ce nom d'utilisateur est déjà utilisé.";

                    } else {
                        sendAccountCreationData(formInfo);
                    }
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(error => {
                console.error('Error fetching accounts : ', error);
                // We still continue, if the username is already taken, the db will returns an error itself
                sendAccountCreationData(formInfo);
            });

    }
});

/*********************************** DELETE ACCOUNT ***************************************/
const deleteAccountMessage = accountDeletePrompt.element.querySelector("#delete_account_message");

// When the user clicks on the button "Supprimer un compte", it updates the list of accounts then it shows the prompt
menu.element.querySelector('button#delete_account').addEventListener('click', () => {
    deleteAccountMessage.textContent = "";
    const accountsSelect = accountDeletePrompt.element.querySelector('select.account');
    // Send a GET request to get the list of the accounts
    fetch('/admin/accounts-list')
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // Delete previous content 
                accountsSelect.innerHTML = '';
                // Add the accounts to the select object
                res.users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.username;
                    option.label = user.username;
                    accountsSelect.appendChild(option);
                });
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            deleteAccountMessage.textContent = "Les comptes n'ont pas été récupérés.";
            console.error('Error fetching accounts : ', error);
        });
    menu.hide();
    accountDeletePrompt.show();
});

// When the user clicks on the prompt button "Supprimer le compte", it hides the prompt
const deleteAccountForm = accountDeletePrompt.element.querySelector("#delete_account_form");
deleteAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new URLSearchParams(new FormData(deleteAccountForm));
    fetch('admin/delete-account', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                appMessage.showMessage("Le compte a été supprimé.");
                accountDeletePrompt.hide();
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            deleteAccountMessage.textContent = "Le compte n'a pas été supprimé.";
            console.error('Error fetching accounts : ', error);
        });
});

/*********************************** CHANGE PASSWORD ***************************************/
const passwordChangeMessage = passwordChangePrompt.element.querySelector("#password_change_message");

// When the user clicks on the button "Créer un compte", it shows the prompt
menu.element.querySelector('button#change_password').addEventListener('click', function () {
    passwordChangeMessage.textContent = "";
    menu.hide();
    passwordChangePrompt.show();
});

// When the user clicks on the prompt button "Créer le compte", it hides the prompt
const passwordChangeForm = passwordChangePrompt.element.querySelector("#password_change_form");
passwordChangeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formInfo = new FormData(passwordChangeForm);
    // We check the password (it will also be checked on the server)
    if (formInfo.get('password').length < 5) {
        passwordChangeMessage.textContent = "Le mot de passe doit avoir 5 caractères ou plus.";
        return;
    } else if (formInfo.get('password') !== formInfo.get('password_verification')) {
        passwordChangeMessage.textContent = "Les mots de passe doivent correspondre.";
        return;
    }
    // We send the new password
    const data = new URLSearchParams(formInfo);
    fetch('admin/change-password', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                appMessage.showMessage("Le mot de passe a été changé.");
                passwordChangePrompt.hide();
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            passwordChangeMessage.textContent = "Le mot de passe n'a pas été changé.";
            console.error('Error changing password : ', error);
        });
});