import {
    Uri,
    WebviewPanel,
    Disposable,
    ViewColumn,
    window,
    Webview,
    ExtensionContext,
} from "vscode";
import { getUri } from "../util/VSCUtil";
import { readFileSync } from "fs";
import { FormatStr } from "../util/FormatStr";
import { GdbInterface } from "../gdb/GdbInterface";
import createWebviewPanel = window.createWebviewPanel;
import showInformationMessage = window.showInformationMessage;
import format = FormatStr.format;
import { Message } from "../message/Message";
import { MessageType } from "../message/MessageType";

export class VSCDBG {
    private panel: WebviewPanel | undefined = undefined;
    private disposables: Disposable[] = [];
    private gdb: GdbInterface;
    context: ExtensionContext;
    extensionUri: Uri;

    private initPanel(): void {
        this.panel = createWebviewPanel("vscdbg", "VSCDBG", ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        this.panel.onDidDispose(this.dispose, null, this.disposables);
        this.panel.webview.html = this._getWebviewContent(
            this.panel.webview,
            this.extensionUri,
        );
        this._setWebviewMessageListener(this.panel.webview);
    }

    constructor(context: ExtensionContext, gdb: GdbInterface) {
        this.context = context;
        this.extensionUri = context.extensionUri;
        this.gdb = gdb;
    }

    setGdb(gdb: GdbInterface): void {
        this.gdb = gdb;
    }

    public render() {
        if (this.panel) {
            this.panel.reveal(ViewColumn.One);
        } else {
            this.initPanel();
        }
    }

    public dispose() {
        /* TODO: why does this error out */
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        const toolkitUri = getUri(
            webview,
            extensionUri,
            "node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js",
        );
        const mainUri = getUri(webview, extensionUri, "web/main.js");
        const styleUri = getUri(webview, extensionUri, "web/style.css");
        const codiconsUri = getUri(
            webview,
            extensionUri,
            "node_modules/@vscode/codicons/dist/codicon.css",
        );
        const firaCodeRegularWoff2Uri = getUri(
            webview,
            extensionUri,
            "web/font/woff2/FiraCode-Regular.woff2",
        );
        const firaCodeRegularWoffUri = getUri(
            webview,
            extensionUri,
            "web/font/woff/FiraCode-Regular.woff",
        );
        const firaCodeBoldWoff2Uri = getUri(
            webview,
            extensionUri,
            "web/font/woff2/FiraCode-Bold.woff2",
        );
        const firaCodeBoldWoffUri = getUri(
            webview,
            extensionUri,
            "web/font/woff/FiraCode-Bold.woff",
        );
        const indexContent = readFileSync(
            getUri(webview, extensionUri, "web/index.html").fsPath,
            "utf-8",
        );
        const indexLoaded = format(indexContent, {
            toolkitUri: toolkitUri.toString(),
            mainUri: mainUri.toString(),
            styleUri: styleUri.toString(),
            codiconsUri: codiconsUri.toString(),
            firaCodeRegularWoff2Uri: firaCodeRegularWoff2Uri.toString(),
            firaCodeRegularWoffUri: firaCodeRegularWoffUri.toString(),
            firaCodeBoldWoff2Uri: firaCodeBoldWoff2Uri.toString(),
            firaCodeBoldWoffUri: firaCodeBoldWoffUri.toString(),
        });
        return indexLoaded;
    }

    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(this.receiveMessage, undefined, this.disposables);
    }

    receiveMessage(message: Message) {
        switch (message.type) {
            case MessageType.GDB_COMMAND: {
                this.gdb.execute(message.data);
            }
            default: {
                showInformationMessage(
                    `VSCDBG: Received unexpected message type ${message.type}`,
                );
            }
        }
    }

    sendMessage(message: Message) {
        this.panel.webview.postMessage(message);
    }
}
