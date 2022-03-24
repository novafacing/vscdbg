import { commands, ExtensionContext, workspace, window } from "vscode";
import { GdbInterface } from "./gdb/GdbInterface";
import { VSCDBG } from "./backend/VSCDBG";
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

    if (!gdb) {
        throw Error("No gdb!");
    }

    const backend = new VSCDBG(context, <GdbInterface>gdb);

    const vscdbgCommand = registerCommand("vscdbg.vscdbg", () => {
        backend.render();
    });
    context.subscriptions.push(vscdbgCommand);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    gdb?.close();
}
