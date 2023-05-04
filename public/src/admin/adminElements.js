"use strict";

/*********************************** MESSAGE ***************************************/
// This class provide methods to display a message for 3s
export class Message {
    constructor(elementId) {
        this.element = document.querySelector(elementId);
        this.currentTimeout = null;
    }
    // Do not use this method, use showMessage() or showError() instead
    showTextMessageApp(text, timeInMs, textColor = "#e5e5e5") {
        this.element.style.color = textColor;
        clearTimeout(this.currentTimeout);
        this.element.textContent = text;
        this.currentTimeout = setTimeout(() => {
            this.element.textContent = "";
        }, timeInMs);
    }

    showMessage(messageText, timeInMs = 3000) {
        this.showTextMessageApp(messageText, timeInMs, "#e5e5e5");
    }

    showError(errorText, timeInMs = 4000) {
        this.showTextMessageApp(errorText, timeInMs, "#cc0000");
    }
}

/*********************************** GLASSES ***************************************/
export class GlassBase {
    constructor(elementId) {
        this.element = document.querySelector(elementId);
        this.associated = null;
    }

    show(elementToAssociate = null) {
        this.element.style.zIndex = "14";
        this.associated = elementToAssociate;
    }

    hide() {
        this.element.style.zIndex = "-14";
    }
}

// This class as only one instance. 
// The glass 'hides' the rest of the screen when the user clicks on a session and that the actions buttons are shown
export class SessionGlass extends GlassBase {
    constructor(glassId) {
        super(glassId);
        this.glass = this.element;  // utilisé comme alias
        this.glass.addEventListener('click', () => this.hide());
    }

    hide() {
        super.hide();
        try {
            this.associated.style.zIndex = "-15";
        } catch (error) {
            console.log("Une erreur s'est produite: " + error.message);
        }
    }
}

/*********************************** PROMPTS ***************************************/
// Each prompt have its instance of this class or its daughters 
export class Prompt extends GlassBase {
    constructor(promptId) {
        super(promptId);
        this.prompt = this.element;  // prompt alias de element
        const closeButton = this.prompt.querySelector(".close");
        if (closeButton !== null) {
            closeButton.addEventListener('click', () => this.hide());
        }
    }
}

export class PromptWithCancel extends Prompt {
    constructor(promptId) {
        super(promptId);
        this.prompt.querySelector("button.cancel").addEventListener('click', () => this.hide());
    }
}

