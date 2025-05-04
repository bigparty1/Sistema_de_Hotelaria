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
