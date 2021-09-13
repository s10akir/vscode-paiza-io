import { Language as PaizaIoLanguage } from "@s10akir/node-paiza-io/dist/types";

/**
 * 
 * compare language name with paizaIO supported language
 * 
 * @param language language name string
 * @returns paizaIO language identifier or null 
 * language is not supported when return null
 */
export function comparePaizaIoLanguage(language: string): PaizaIoLanguage | null {
  switch (language) {
    case 'plaintext':
      return 'plain';
    case 'clojure':
      return 'clojure';
    case 'coffeescript':
      return 'coffeescript';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'csharp':
      return 'csharp';
    case 'fsharp':
      return 'fsharp';
    case 'go':
      return 'go';
    case 'html':
      return 'php';
    case 'java':
      return 'java';
    case 'javascript':
      return 'javascript';
    case 'objective-c':
      return 'objective-c';
    case 'perl':
      return 'perl';
    case 'php':
      return 'php';
    case 'python':
      return 'python3';
    case 'r':
      return 'r';
    case 'ruby':
      return 'ruby';
    case 'rust':
      return 'rust';
    case 'shellscript':
      return 'bash';
    case 'sql':
      return 'mysql';
    case 'typescript':
      return 'typescript';
    case 'vb':
      return 'vb';
    case 'nadesiko':
      return 'nadesiko';
    default:
      return null;
  }
}