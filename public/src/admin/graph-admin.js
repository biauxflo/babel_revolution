"use strict";

/*********************************** IMPORTS ***************************************/
import { ToggleAside, AsideDiv } from "./graph-adminElements.js";
import { Message } from "./adminElements.js";

/*********************************** VARIABLES ***************************************/
const socket = io();

const appMessage = new Message('#application_message');

const aside = new ToggleAside();
const publishDecree = new AsideDiv('#publish_decree');

/*
aside.aside.addEventListener('click', function () {
    socket.emit('databaseUpdate');
});
*/

// When the user clicks on "Promulger un décret", it updates the list of decrees
publishDecree.head.addEventListener('click', () => {
    // Send a GET request to get the list of the decrees
    fetch('/graph-admin/get-decrees')
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // Delete previous content 
                publishDecree.select.innerHTML = '';
                // Add the decrees to the select object
                res.decrees.forEach(decree => {
                    const option = document.createElement('option');
                    option.value = decree.id;
                    option.label = decree.title;
                    option.decreeText = decree.text;
                    publishDecree.select.appendChild(option);
                });
                // Show the current decree text
                publishDecree.body.querySelector('p.show_selected').textContent = publishDecree.select.selectedOptions[0].decreeText;
            } else {
                throw new Error(res.error);
            }
        })
        .catch(error => {
            appMessage.showError("Les décrets n'ont pas été récupérés.");
            console.error('Error fetching decrees : ', error);
        });
});

// When the user change the selected decree, it changes the text to show the current decree text
publishDecree.select.addEventListener('change', function () {
    publishDecree.body.querySelector('p.show_selected').textContent = publishDecree.select.selectedOptions[0].decreeText;
});