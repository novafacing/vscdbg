import * as vscode from "vscode";
import { VSCDBGPanel } from "./panels/VSCDBGPanel";

export function activate(context: vscode.ExtensionContext) {
    console.log("Activating VSCDBG Extension...");
    const vscdbgCommand = vscode.commands.registerCommand("vscdbg.vscdbg", () => {
        VSCDBGPanel.render(context.extensionUri);
    });
    context.subscriptions.push(vscdbgCommand);
}

// this method is called when your extension is deactivated
export function deactivate(): void {}
