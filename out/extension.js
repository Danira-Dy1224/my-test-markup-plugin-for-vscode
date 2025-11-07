"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
//массив для хранения состояний подсвеченных диапозонов
let highlightedAreas = [];
//глобальный объект для описания того, как будет окрашиваться выделенная зона текста
const decorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(0, 255, 0, 0.25)', //прозрачный фон
    border: '1px solid aqua', //рамка вокруг
    borderRadius: '4px', //скругление рамки
    isWholeLine: false,
    fontWeight: 'bold',
    fontStyle: 'italic',
});
function isTextHighlighted(area) {
    return highlightedAreas.some(existingArea => existingArea.isEqual(area)); //сравниваем, есть ли закрашенная зона
}
async function fetchCppInfo(query) {
    const url = `https://duckduckgo.com/?sites=cppreference.com&q=${query}&ia=web`;
    try {
        const response = await axios_1.default.get(url);
        vscode.window.showInformationMessage(`Documentation for ${query}: ${url}`);
        return url;
    }
    catch (error) {
        return `Error to fetch data from this query.`;
    }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "my-test-markup-plugin" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('my-test-markup-plugin.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from test_markup_plugin!');
    });
    let disposableUserCmd = vscode.commands.registerCommand('my-test-markup-plugin.fetchInfo', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);
            console.log(`Selected test: ${selectedText}`);
            if (selectedText) {
                const result = await fetchCppInfo(selectedText);
                // vscode.window.showInformationMessage(result);
                console.log(`the query: ${result}`);
                vscode.env.openExternal(vscode.Uri.parse(result));
            }
            else {
                vscode.window.showInformationMessage(`Text is not selected for searching`);
            }
        }
        else {
            vscode.window.showErrorMessage(`Error - something has gone wrong.`);
        }
    });
    let highlightText = vscode.commands.registerCommand('my-test-markup-plagin.highlightText', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage(`Error - something has gone wrong.`);
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage(`Please, select the needed range of the text to highlight it.`);
            return;
        }
        const range = new vscode.Range(selection.start, selection.end);
        if (isTextHighlighted(range)) {
            highlightedAreas = highlightedAreas.filter(r => !r.isEqual(range));
            vscode.window.showInformationMessage(`Highlighted area of the text was successfully removed!`);
            console.log(`Highlighted area of the text was successfully removed!`);
        }
        else {
            highlightedAreas.push(range);
            vscode.window.showInformationMessage(`Text was successfully highlighted!`);
            console.log(`Text was successfully highlighted!`);
        }
        editor.setDecorations(decorationType, highlightedAreas);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableUserCmd);
    context.subscriptions.push(highlightText);
}
// This method is called when your extension is deactivated
function deactivate() {
    highlightedAreas = [];
}
//# sourceMappingURL=extension.js.map