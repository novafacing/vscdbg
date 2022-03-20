import { Uri, Webview } from "vscode";

export function getUri(webview: Webview, extensionUri: Uri, path: string) {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...path.split("/")));
}
