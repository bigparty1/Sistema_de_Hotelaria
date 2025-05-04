export class ConsoleService {
    
    static #instance = new ConsoleService();

    larguraTela;
    alturaTela;
    #funcsResize = [];
    #funcsKeyPress = [];

    CoresTexto = {
        PRETO: '\x1b[30m',
        VERMELHO: '\x1b[31m',
        VERDE: '\x1b[32m',
        AMARELO: '\x1b[33m',
        AZUL: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        CIANO: '\x1b[36m',
        BRANCO: '\x1b[37m'
    };

    CoresFundo = {
        PRETO: '\x1b[40m',
        VERMELHO: '\x1b[41m',
        VERDE: '\x1b[42m',
        AMARELO: '\x1b[43m',
        AZUL: '\x1b[44m',
        MAGENTA: '\x1b[45m',
        CIANO: '\x1b[46m',
        BRANCO: '\x1b[47m'
    };
    
    constructor() {
        this.larguraTela = process.stdout.columns;
        this.alturaTela = process.stdout.rows;

        process.stdin.setRawMode(true);
        process.stdin.resume();

        process.stdout.on('resize', () => {
            this.larguraTela = process.stdout.columns;
            this.alturaTela = process.stdout.rows;
            this.#funcsResize.forEach(key => {
                key.value();
            });
        });

        process.stdin.on('data', (key) => {
            if (key.toString() === '\x03') { // Ctrl+C          
                this.destructor();
                process.exit(0);
            } else {
                this.#funcsKeyPress.forEach(func => {
                    func.value(key.toString());
                });
            }
        });
    }

    destructor() {
        this.habilitarCursor();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.removeAllListeners('resize');
        process.stdin.removeAllListeners('data');
    }

    static getInstance() {
        return ConsoleService.#instance;
    }

    RegisterResizeEvent(identifier, func) {
        this.#funcsResize.push({identifier: func });
    }

    RemoveResizeEvent(idenfifier) {
        this.#funcsResize = this.funcsResize.filter(key => key.idenfier !== idenfifier);
    }

    RegisterKeyPressEvent(identifier, func) {
        this.#funcsKeyPress.push({identifier: func });
    }

    RemoveKeyPressEvent(identifier) {
        this.#funcsKeyPress = this.funcsKeyPress.filter(key => key.idenfier !== identifier);
    }

    print(texto, corTexto, corFundo) {
        process.stdout.write(`${corTexto}${corFundo}${texto}\x1b[0m`);
    }

    printLine(texto, corTexto, corFundo) {
        process.stdout.write(`${corTexto}${corFundo}${texto}\x1b[0m\n`);
    }

    centralizarTexto(texto, tamanho)
    {
        const espacos = Math.floor((tamanho - texto.length) / 2);
        return ' '.repeat(espacos) + texto + ' '.repeat(espacos);        
    }

    gotoxy(x, y) {
        process.stdout.write(`\x1b[${y};${x}H`);
    }

    limpaTela() {
        process.stdout.write('\x1b[2J');
        process.stdout.write('\x1b[3J');
        process.stdout.write('\x1b[H');
    }

    desabilitarCursor() {
        process.stdout.write('\x1b[?25l');
    }

    habilitarCursor() {
        process.stdout.write('\x1b[?25h');
    }
}

// const consoleService = new ConsoleService();

// process.stdin.clear;

// console.log('\x1b[30m\x1b[47mTexto com fundo branco\x1b[0m');
// process.stdout.write('\x1b[30m\x1b[47mTexto com fundo branco\x1b[0m\n');

// consoleService.DesenharMenu();

//pressione enter para continuar (com process)
// process.stdin.setRawMode(true);
// // process.stdin.resume();
// process.stdin.on('data', (key) => {
    
    
//     switch(key.toString()) {
//         case '\u001B\u005B\u0041': // Up arrow
//             // console.log('Up arrow pressed');
//             consoleService.print('Up arrow pressed', consoleService.CoresTexto.VERMELHO, consoleService.CoresFundo.AMARELO);
//             consoleService.gotoxy(0, 0);
//             break;
//         case '\u001B\u005B\u0042': // Down arrow
//             console.log('Down arrow pressed');
//             break;
//         case '\u001B\u005B\u0043': // Right arrow
//             console.log('Right arrow pressed');
//             break;
//         case '\u001B\u005B\u0044': // Left arrow
//             console.log('Left arrow pressed');
//             break;
//         case '\x1b': // Escape key
//             console.log('Escape key pressed');
//             process.stdin.setRawMode(false);
//             process.stdin.pause();
//             break;
//         default:
//             console.log(`Key pressed: ${key.toString()}`);
//     }
    
//     // if (if) { // Enter key
//     //     console.log(key.toString());
//     //     process.stdin.setRawMode(false);
//     //     process.stdin.pause();
//     //     // console.clear();
//     // }
// });
