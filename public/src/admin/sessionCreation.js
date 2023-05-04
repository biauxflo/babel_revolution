"use strict";

// This function sends an ajax request to the server to change the visibility of a completed session
export function changeVisibility(id, visible, appMessage) {
    // destinationSessionset is visibleSessionsSet or nonVisibleSessionsSet
    const data = new URLSearchParams({ id, visible });
    return fetch('/admin/change-visibility', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                appMessage.showMessage("La visibilité de la session a été changée.");
                return true;
            } else {
                throw new Error('server response : success = false');
            }
        })
        .catch(error => {
            appMessage.showError("Erreur lors du changement de visibilité.")
            console.error('Visibility did not change : ', error);
            return false;
        });
}

// This function move a completed function into either visibleSessionsSet or nonVisibleSessionsSet, depending on its visibility
export function moveCompletedSession(session, buttonToChange, visibleSessionsSet, nonVisibleSessionsSet, actionsGlass, appMessage) {
    // We suppress the precedent event listeners on the button by replacing it by its copy
    const newButton = buttonToChange.cloneNode(true);
    buttonToChange.parentNode.replaceChild(newButton, buttonToChange);
    // We get the attributes id and visible of the session
    const id = session.getAttribute('id');
    // Then, depending on if the session is visible or not, we insert it into the correct section and we configure the button
    if (session.getAttribute('visible') === 'true') {
        // Visible Session
        // The button changes into "Cacher"
        newButton.className = 'hide';
        newButton.textContent = 'Cacher';
        newButton.addEventListener('click', function () {
            session.setAttribute('visible', false);
            changeVisibility(id, false, appMessage).then(success => {
                if (success) {
                    moveCompletedSession(session, newButton, visibleSessionsSet, nonVisibleSessionsSet, actionsGlass, appMessage);
                }
            })
            actionsGlass.hide();
        });
        visibleSessionsSet.appendChild(session);
    } else {
        // Non Visible Session
        // The button changes into "Montrer"
        newButton.className = 'show';
        newButton.textContent = 'Montrer';
        newButton.addEventListener('click', function () {
            session.setAttribute('visible', true);
            changeVisibility(id, true, appMessage).then(success => {
                if (success) {
                    moveCompletedSession(session, newButton, visibleSessionsSet, nonVisibleSessionsSet, actionsGlass, appMessage);
                }
            })
            actionsGlass.hide();
            actionsGlass.hide();
        });
        nonVisibleSessionsSet.appendChild(session);
    }
}

// This function creates the div with the new session and insert it among the ongoing sessions
export function addSessionHTML(template, sessionInfo, actionsGlass, ongoingSessionsSet, divToInsertBefore,
    visibleSessionsSet, nonVisibleSessionsSet, renamePrompt, deletePrompt, appMessage) {
    // template is the result of document.querySelector('#session_template')
    // title and author are string
    // actionsGlass is the result of document.querySelector('#session_actions_glass')

    // We clone the template
    const session = template.cloneNode(true);
    // Then we modify what is needed
    session.setAttribute('id', sessionInfo.id);
    session.querySelector('.session_title').textContent = sessionInfo.title;
    session.querySelector('.session_author').textContent = 'Créé par ' + sessionInfo.author;
    session.querySelector('img.graph').src = 'img/' + sessionInfo.image;
    session.setAttribute('completed', sessionInfo.completed);
    session.setAttribute('visible', sessionInfo.visible);

    /*********************************** LISTENERS CONFIG ***************************************/
    const actionsDiv = session.querySelector('.session_actions');
    session.querySelector('img').addEventListener('click', function () {
        // When the user click on a session, it shows the possible actions
        actionsDiv.style.zIndex = "15";
        actionsGlass.show(actionsDiv);
    });

    actionsDiv.querySelector('button.enter').addEventListener('click', function () {
        // When the user click on the button "Entrer", it loads the session
        document.location.href = window.location.href + '/' + sessionInfo.id;
    });

    actionsDiv.querySelector('button.rename').addEventListener('click', function () {
        // When the user click on the button "Renommer", it shows the rename prompt
        renamePrompt.show(session);
        actionsGlass.hide();
    });

    actionsDiv.querySelector('button.delete').addEventListener('click', function () {
        // When the user click on the button "Supprimer", it shows the delete prompt to confirm
        deletePrompt.show(session);
        actionsGlass.hide();
    });

    // Depending on if the session is completed or not, and if it is visible or not, we will insert it into a different section
    // and we will configure the 'second button' differently
    const secondButton = actionsDiv.querySelector('button.link');
    if (sessionInfo.completed === false) {
        // Ongoing Session
        // We add the listener for the button "Copier le lien"
        secondButton.addEventListener('click', function () {
            // When the user click on the button "Copier lien", it copies the link
            let adress = window.location.href + '/' + sessionInfo.id;
            navigator.clipboard.writeText(adress)
                .then(() => {
                    appMessage.showMessage("Le lien a été copié.")
                    console.log("L'adresse '" + adress + "' a été copié dans le presse-papiers.");
                })
                .catch((err) => {
                    appMessage.showError("Erreur, le lien n'a pas été copié.")
                    console.error('Une erreur est survenue lors de la copie dans le presse-papiers : ', err);
                });
            actionsGlass.hide();
        });
        ongoingSessionsSet.insertBefore(session, divToInsertBefore);
    } else {
        // Completed Session
        moveCompletedSession(session, secondButton, visibleSessionsSet, nonVisibleSessionsSet, actionsGlass, appMessage);
    }
}

// This function sends an ajax request to the server to create the session in the database
export function createSession(template, title, actionsGlass, sessionsSetDiv, divToInsertBefore,
    visibleSessionsSet, nonVisibleSessionsSet, renamePrompt, deletePrompt, appMessage) {
    const data = new URLSearchParams({ title });
    fetch('/admin/create-session', {
        method: 'post',
        body: data
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                addSessionHTML(template, res.session, actionsGlass, sessionsSetDiv, divToInsertBefore,
                    visibleSessionsSet, nonVisibleSessionsSet, renamePrompt, deletePrompt, appMessage);
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError('Erreur lors de la création de la session.');
            console.error('Error creating session : ', error);
        });
}