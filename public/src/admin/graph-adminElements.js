"use strict";

// This class is for the aside menu and make its elements toggle
export class ToggleAside {
    constructor() {
        this.element = document.querySelector('aside');
        // divsBodiesList is a list with each div body of the aside's div
        this.divsList = [];
        // For each div head, we add a listener
        document.querySelectorAll('aside > div').forEach(div => {
            const toggleIndicator = div.querySelector('p.toggle_indicator');
            const divBody = div.querySelector('div.body');
            this.divsList.push({ body: divBody, toggleIndicator: toggleIndicator });
            // When we click on the head, it toggles
            div.querySelector('div.head').addEventListener('click', () => this.toggleOne(divBody, toggleIndicator));
        });
    }

    // This method show only one body, or hide them all
    toggleOne(divBody, toggleIndicator) {
        // We check the divBody's display :  'none' -> we show it,   'block' -> we hide it
        const showDiv = (divBody.style.display === 'none');
        // We hide all the divs bodies
        this.divsList.forEach(div => {
            div.toggleIndicator.textContent = "►";
            div.body.style.display = "none";
        });
        // Then, we may show divBody
        if (showDiv) {
            toggleIndicator.textContent = "▼";
            divBody.style.display = "block";
        }
    }
}

// This class is for the aside's elements
export class AsideDiv {
    constructor(divId) {
        this.div = document.querySelector(divId);
        this.head = this.div.querySelector('div.head');
        this.body = this.div.querySelector('div.body');
        this.submit = this.body.querySelector('button.submit');

        this.select = this.body.querySelector('select');  // Depends on the div, this element may be null
        this.selectedText = this.body.querySelector('p.show_selected');  // Depends on the div, this element may be null
        if (this.select) {
            // We add a listener that updates the text when the option change
            this.select.addEventListener('change', () => {
                this.selectedText.textContent = this.select.selectedOptions[0].element.text;
            });
        }
    }

    // This method updates the select options with the list given as argument
    updateSelect(elementsList) {
        // Delete previous content 
        this.select.innerHTML = '';
        // Add the elements to the select object
        elementsList.forEach(element => {
            const option = document.createElement('option');
            option.value = element.id;
            option.label = element.title;
            option.element = element;
            this.select.appendChild(option);
        });
        // Show the current element text
        this.selectedText.textContent = this.select.selectedOptions[0].element.text;
    }
}