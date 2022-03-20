import { spawn, ChildProcess } from "child_process";
import { GDB } from "../gdb-js/src/index";

export class GdbInterface {
    server: ChildProcess;
    _gdb: ChildProcess;
    client: GDB;
    port: number;

    constructor(port: number) {
        this.port = port;
        this.server = spawn("gdbserver", ["--multi", `:${this.port}`], {
            detached: true,
        }).on("error", (err) => {
            throw err;
        });

        this._gdb = spawn("gdb-multiarch", ["-i=mi"]);
        this.client = new GDB(this._gdb);
    }

    close(): void {
        this.server.kill();
    }
}
