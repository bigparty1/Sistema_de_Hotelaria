import { LogService } from "./logService.js";

/**
 * @author Kauê Gomes
 * @file ConsoleService.js
 * @module ConsoleService
 * @description Serviço para manipulação do console, 
 *              incluindo eventos de resize e keypress.
 * @requires module:process
 */
export class ConsoleService {
    static #instace = new ConsoleService();

    /** @description Largura atual do console, em unidades console */
    larguraTela;
    /** @description Altura atual do console, em unidades console */
    alturaTela;

    #funcsResize = [];
    #funcsKeyPress = [];

    /** @description Cores de texto disponíveis para impressão no console */
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

    /** @description Cores de fundo de texto disponíveis para impressão no console */
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
        this.limpaTela();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.removeAllListeners('resize');
        process.stdin.removeAllListeners('data');
    }

    /** @returns Instância da classe ConsoleService  */
    static getInstace() {
        return ConsoleService.#instace;
    }

    /** 
     * @description Registra funções para serem chamadas quando o console for redimencionado 
     * @param {string} identifier - Identificador da função a ser registrada
     * @param {function} func - Função a ser chamada quando o console for redimencionado
    */
    RegisterResizeEvent(identifier, func) {
        LogService.getInstace().debug(`Registrando evento de resize: ${identifier}`);
        this.#funcsResize.push({identifier: identifier, value: func });
    }

    /**
     * @description Remove funções registradas para serem chamadas quando o console for redimencionado
     * @param {string} idenfifier - Identificador da função a ser removida
     */
    RemoveResizeEvent(idenfifier) {
        LogService.getInstace().debug(`Removendo evento de resize: ${idenfifier}`);
        this.#funcsResize = this.#funcsResize.filter(key => key.identifier !== idenfifier);
    }

    /**
     * @description Registra funções para serem chamadas quando uma tecla for pressionada
     * @param {string} identifier - Identificador da função a ser registrada
     * @param {function} func - Função a ser chamada quando uma tecla for pressionada
     */
    RegisterKeyPressEvent(identifier, func) {
        LogService.getInstace().debug(`Registrando evento de keypress: ${identifier}`);
        this.#funcsKeyPress.push({identifier: identifier, value: func });
    }

    /**
     * @description Remove funções registradas para serem chamadas quando uma tecla for pressionada
     * @param {string} idenfifier - Identificador da função a ser removida
     */
    RemoveKeyPressEvent(identifier) {
        LogService.getInstace().debug(`Removendo evento de keypress: ${identifier}`);
        this.#funcsKeyPress = this.#funcsKeyPress.filter(key => key.identifier !== identifier);
    }

    /**
     * @description Imprime texto no console com cores de texto e fundo (sem quebra de linha)
     * @param {string} texto - Texto a ser impresso
     * @param {ConsoleService.CoresTexto} corTexto - Cor do texto
     * @param {ConsoleService.corFundo} corFundo - Cor do fundo
     * @example
     * consoleService.print('Hello World', consoleService.CoresTexto.VERMELHO, consoleService.CoresFundo.BRANCO);
     */
    print(texto, corTexto = '', corFundo = '') {
        process.stdout.write(`${corTexto}${corFundo}${texto}\x1b[0m`);
    }

    /**
     * @description Imprime texto no console com cores de texto e fundo (com quebra de linha)
     * @param {string} texto - Texto a ser impresso
     * @param {ConsoleService.CoresTexto} corTexto - Cor do texto
     * @param {ConsoleService.CoresFundo} corFundo - Cor do fundo
     * @example
     * consoleService.printLine('Hello World', consoleService.CoresTexto.VERMELHO, consoleService.CoresFundo.BRANCO);
     */
    printLine(texto, corTexto = '', corFundo = '') {
        process.stdout.write(`${corTexto}${corFundo}${texto}\x1b[0m\n`);
    }

    /**
     * @description Centraliza o texto em relação ao tamanho especificado
     * @param {string} texto - Texto a ser centralizado
     * @param {number} tamanho  - Tamanho total em que o texto deve ser centralizado
     * @returns Texto centralizado em relação ao tamanho especificado 
     */
    centralizarTexto(texto, tamanho)
    {
        const espacos = Math.floor((tamanho - texto.length) / 2);
        let textoCentralizado = ' '.repeat(espacos) + texto + ' '.repeat(espacos);
        if (textoCentralizado.length < tamanho) {
            textoCentralizado += ' ';
        }
        return textoCentralizado;
    }

    /**
     * @description Move o cursor para a posição especificada no console
     * @param {number} x - Posição no eixo x do cursor 
     * @param {number} y - Posição no eixo y do cursor
     */
    gotoxy(x, y) {
        process.stdout.write(`\x1b[${y};${x}H`);
    }

    /**
     * @description Limpa a tela do console
     */
    limpaTela() {
        process.stdout.write('\x1b[2J');
        process.stdout.write('\x1b[3J');
        process.stdout.write('\x1b[H');
    }

    /**
     * @description Desabilita o cursor do console
     */
    desabilitarCursor() {
        process.stdout.write('\x1b[?25l');
    }

    /**
     * @description Habilita o cursor do console
     */
    habilitarCursor() {
        process.stdout.write('\x1b[?25h');
    }
}
