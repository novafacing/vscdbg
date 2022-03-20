import { Uri, WebviewPanel, Disposable, ViewColumn, window, Webview } from "vscode";
import { getUri } from "../util/VSCUtil";
import { readFileSync } from "fs";
import { FormatStr } from "../util/FormatStr";
import { GdbInterface } from "../gdb/GdbInterface";
import createWebviewPanel = window.createWebviewPanel;
import showInformationMessage = window.showInformationMessage;
import format = FormatStr.format;

export class VSCDBGPanel {
    public static currentPanel: VSCDBGPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private gdb: GdbInterface;

    private constructor(panel: WebviewPanel, extensionUri: Uri, gdb: GdbInterface) {
        this._panel = panel;
        this._panel.onDidDispose(this.dispose, null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(
            this._panel.webview,
            extensionUri,
        );
        this._setWebviewMessageListener(this._panel.webview);
        this.gdb = gdb;
    }

    public static render(extensionUri: Uri, gdb: GdbInterface) {
        if (VSCDBGPanel.currentPanel) {
            VSCDBGPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            const panel = createWebviewPanel("vscdbg", "VSCDBG", ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            VSCDBGPanel.currentPanel = new VSCDBGPanel(panel, extensionUri, gdb);
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
        webview.onDidReceiveMessage(
            (message: any) => {
                console.log("Received message ", message);
                showInformationMessage(message);
            },
            undefined,
            this._disposables,
        );
    }
}
