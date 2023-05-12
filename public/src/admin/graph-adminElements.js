"use strict";

export class ToggleAside {
    constructor() {
        this.aside = document.querySelector('aside');
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

