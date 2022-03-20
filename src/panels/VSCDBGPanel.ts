import { Uri, WebviewPanel, Disposable, ViewColumn, window, Webview } from "vscode";
import { getUri } from "../util/VSCUtil";
import createWebviewPanel = window.createWebviewPanel;
import showInformationMessage = window.showInformationMessage;

export class VSCDBGPanel {
    public static currentPanel: VSCDBGPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;
        this._panel.onDidDispose(this.dispose, null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(
            this._panel.webview,
            extensionUri,
        );
        this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri) {
        if (VSCDBGPanel.currentPanel) {
            VSCDBGPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            const panel = createWebviewPanel("vscdbg", "VSCDBG", ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            VSCDBGPanel.currentPanel = new VSCDBGPanel(panel, extensionUri);
        }
    }

    public dispose() {
        VSCDBGPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        const toolkitUri = getUri(
            webview,
            extensionUri,
            "node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js",
        );
        const mainUri = getUri(webview, extensionUri, "web/main.js");
        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1.0">
                <script type="module" src="${toolkitUri}"></script>
                <script type="module" src="${mainUri}"></script>
                <title>Hello World!</title>
            </head>
            <body>
                <h1>Hello World!</h1>
                <vscode-button id="howdy">Howdy!</vscode-button>
            </body>
            </html>
        `;
    }

    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                showInformationMessage(message.text);
            },
            undefined,
            this._disposables,
        );
    }
}
