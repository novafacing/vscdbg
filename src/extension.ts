import { commands, ExtensionContext, workspace, window } from "vscode";
import { GdbInterface } from "./gdb/GdbInterface";
import { VSCDBGPanel } from "./panels/VSCDBGPanel";
import registerCommand = commands.registerCommand;
import getConfiguration = workspace.getConfiguration;
import showErrorMessage = window.showErrorMessage;

let gdb: GdbInterface | undefined = undefined;

export function activate(context: ExtensionContext) {
    console.log("Activating VSCDBG Extension...");
    const config = getConfiguration();
    const gdbPort = config.get<number>("vscdbg.gdbServerPort") ?? 4321;

    try {
        gdb = new GdbInterface(gdbPort);
    } catch (err: any) {
        showErrorMessage(err.toString());
        return;
    }

    const vscdbgCommand = registerCommand("vscdbg.vscdbg", () => {
        VSCDBGPanel.render(context.extensionUri, <GdbInterface>gdb);
    });
    context.subscriptions.push(vscdbgCommand);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    gdb?.close();
}
