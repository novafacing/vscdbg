let frontend = null;

window.addEventListener("load", main);

class VSCDBGFrontend {
    constructor(vscode) {
        this.vscode = vscode;
        window.addEventListener("message", this.handleVsCodeMessage);

        this.setDocumentElements();
        this.setEventListeners();
    }

    setDocumentElements() {
        this.gdbInput = document.getElementById("input");
        this.gdbOutput = document.getElementById("output");
    }

    handleVsCodeMessage(message) {
        console.log("Received vscode message ", message);
    }

    handleGdbInput() {
        console.log("Handling GDB Input...");
        const content = this.gdbInput.value;
        this.vscode.postMessage(content);
    }

    setEventListeners() {
        console.log("Setting up event listeners for UI...");
        this.gdbInput.addEventListener("keyup", ({ key }) => {
            if (key == "Enter") {
                this.handleGdbInput();
            }
        });
    }
}

function main() {
    frontend = new VSCDBGFrontend(acquireVsCodeApi());
}
