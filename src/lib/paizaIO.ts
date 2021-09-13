import * as vscode from 'vscode';

import { comparePaizaIoLanguage } from "./languageUtils";
import NodePaizaIO from '@s10akir/node-paiza-io';
import { RunnerDetail } from '@s10akir/node-paiza-io/dist/types';

export namespace PaizaIO {
  const nodePaizaIO = new NodePaizaIO({ apiKey: 'guest' });
  const stdoutOutputChannel = vscode.window.createOutputChannel('paiza.IO stdout');
  const stderrOutputChannel = vscode.window.createOutputChannel('paiza.IO stderr');
  const detailsOutputChannel = vscode.window.createOutputChannel('paiza.IO details');

  export async function runPaizaIO() {
    // if not open text editor
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const sourceCode = fetchSourceCode();
    const input = await fetchInput();
    const editorLanguage = fetchLanguage();
    const language = comparePaizaIoLanguage(editorLanguage);

    // if paizaIO not support this language
    if (!language) {
      stderrOutputChannel.show();
      stderrOutputChannel.append(`${editorLanguage}: sorry, this language is not supported.`);

      return;
    }

    // run start
    stdoutOutputChannel.show();
    stdoutOutputChannel.append('[INFO] Running on paiza.IO ');

    const runner = await nodePaizaIO.createRunner({
      sourceCode,
      language,
      input
    });

    // poling
    while (await runner.checkRunning()) {
      stdoutOutputChannel.append('.');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    stdoutOutputChannel.appendLine('');

    const details = await runner.getDetails();
    showDetails(details);
  }

  /**
   * fetch current editor language
   * @returns [string] editor language
   */
  function fetchLanguage(): string {
    const textEditor = vscode.window.activeTextEditor;

    return textEditor?.document.languageId || '';
  }

  /**
   * fetch current editor source code
   * @returns [string] editor code
   */
  function fetchSourceCode(): string {
    const textEditor = vscode.window.activeTextEditor;

    return textEditor?.document.getText() || '';
  }

  async function fetchInput(): Promise<string | undefined> {
    const workspace = vscode.workspace;
    const inputFileUrls = await workspace.findFiles('paizaIO.in');
    if (inputFileUrls.length === 0) {
      return undefined;
    }

    const textDocument = await workspace.openTextDocument(inputFileUrls[0]);
    return textDocument.getText();
  }

  function showDetails(details: RunnerDetail) {
    detailsOutputChannel.appendLine(JSON.stringify(details, null, 2));

    // logging output
    stdoutOutputChannel.appendLine(details.stdout || '');
    stdoutOutputChannel.appendLine(`[INFO] Exit (code: ${details.exitCode})`);
    stdoutOutputChannel.appendLine('');

    // when happen error in build
    if (details.buildResult && details.buildResult !== 'success') {
      stderrOutputChannel.show();

      const buildStdout = details.buildStdout;
      const buildStderr = details.buildStderr;

      if (buildStdout) {
        stderrOutputChannel.appendLine('[Error] Build Stdout');
        stderrOutputChannel.appendLine('');

        stderrOutputChannel.appendLine(buildStdout);
        stdoutOutputChannel.appendLine('');
      }

      if (buildStderr) {
        stderrOutputChannel.appendLine('[Error] Build Stderr');
        stderrOutputChannel.appendLine('');

        stderrOutputChannel.appendLine(buildStderr);
        stderrOutputChannel.appendLine('');
      }

      return;
    }

    // error in run
    if (details.result !== 'success') {
      const stderr = details.stderr;

      if (stderr) {
        stderrOutputChannel.appendLine('[Error] Stderr');
        stderrOutputChannel.appendLine(stderr);

        stderrOutputChannel.appendLine('');
      }
    };
  }
}

export default PaizaIO;