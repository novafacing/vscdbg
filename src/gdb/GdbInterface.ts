import { window } from "vscode";
import { spawn, ChildProcess } from "child_process";
import { GDB } from "./gdb-ts";
import { Message } from "../message/Message";
import { MessageType } from "../message/MessageType";
import showErrorMessage = window.showErrorMessage;

export class GdbInterface {
    server: ChildProcess;
    _gdb: ChildProcess;
    client: GDB;
    port: number;
    sendMessage: Function | undefined = undefined;

    constructor(port: number) {
        this.port = port;
        this.server = spawn("gdbserver", ["--multi", `:${this.port}`], {
            detached: true,
        }).on("error", (err) => {
            throw err;
        });

        this._gdb = spawn("gdb-multiarch", ["-i=mi"]);

        this._gdb.on("error", (err) => {
            throw new Error(err.message);
        });

        this.client = new GDB(this._gdb);
    }

    setSendMessage(sendMessage: Function) {
        this.sendMessage = sendMessage;
    }

    async execute(command: string) {
        await this.client.execCLI(command, null).then(
            (v) => {
                this.sendMessage?.(<Message>{ type: MessageType.GDB_OUTPUT, data: v });
            },
            (err) => {
                showErrorMessage(err);
            },
        );
    }

    close(): void {
        this.server.kill();
        this._gdb.kill();
    }
}
