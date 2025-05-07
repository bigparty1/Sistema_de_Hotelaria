import { ConsoleService } from '../service/ConsoleService.js';
import { LogService } from '../service/logService.js';

export class MenuView {
    
    identifier = 'MenuView';
    opcaoSelecionada = 0;
    opcoes = {
        0: '0. Consultar Hoteis            ',
        1: '1. Cadastrar Hoteis            ',
        2: '2. Consultar Clientes          ',
        3: '3. Cadastrar Clientes          ',
        4: '4. Consultar Reservas          ',
        5: '5. Cadastrar Reservas          ',
        6: '6. Cancelar Reserva            ',
        7: '7. Confirmar Chegada (Check-in)',
        8: '8. Confirmar Saida (Check-out) ',
        9: '9. Sair                        ',
    }
    
    #consoleService = null;
    #callbackSelecionarOpcao = null;
    
    constructor() {
        this.#consoleService = ConsoleService.getInstance();
    }

    destructor() {
        LogService.getInstace().debug('Destruindo MenuView...');
        this.#consoleService.RemoveResizeEvent(this.identifier);
        this.#consoleService.RemoveKeyPressEvent(this.identifier);
        this.#consoleService.habilitarCursor();
        this.#consoleService.limpaTela();
    }

    Start() {
        this.#consoleService.desabilitarCursor();
        this.#consoleService.RegisterResizeEvent(this.identifier, () => this.DesenharMenu());
        this.#consoleService.RegisterKeyPressEvent(this.identifier, (key) => this.NavegarMenu(key));
        this.DesenharMenu();
    }

    DesenharMenu() {
        // Limpa a tela
        this.#consoleService.limpaTela();
        
        // Print Titulo
        this.#consoleService.gotoxy(1, 1);
        this.#consoleService.print(
            this.#consoleService.centralizarTexto('Sistema de Hotelaria', this.#consoleService.larguraTela), 
            this.#consoleService.CoresTexto.CIANO, 
            this.#consoleService.CoresFundo.MAGENTA
        );

        // Print das opções
        this.DesenharOpcoes();

        // Print Rodape de instruções
        this.#consoleService.gotoxy(1, this.#consoleService.alturaTela);
        this.#consoleService.print(
            this.#consoleService.centralizarTexto('Use as setas para navegar e ENTER para selecionar', this.#consoleService.larguraTela), 
            this.#consoleService.CoresTexto.PRETO, 
            this.#consoleService.CoresFundo.BRANCO
        );
    }

    DesenharOpcoes()
    {
        let linhaImpressao = Math.floor((this.#consoleService.alturaTela - Object.keys(this.opcoes).length) / 2);
        for (let i = 0; i < Object.keys(this.opcoes).length; i++) {
            this.#consoleService.gotoxy(1, linhaImpressao++);
            this.#consoleService.print(
                this.#consoleService.centralizarTexto(this.opcoes[i], this.#consoleService.larguraTela), 
                this.opcaoSelecionada === i ? this.#consoleService.CoresTexto.PRETO : '', 
                this.opcaoSelecionada === i ? this.#consoleService.CoresFundo.BRANCO : ''
            )
        }
    }

    QuandoSelecionarOpcao(func) {
        this.#callbackSelecionarOpcao = func;
    }

    NavegarMenu(tecla) {
        switch(tecla) {
            case '\x1b[A': // seta para cima
                this.opcaoSelecionada = (this.opcaoSelecionada - 1 + Object.keys(this.opcoes).length) % Object.keys(this.opcoes).length;
                break;
            case '\x1b[B': // seta para baixo
                this.opcaoSelecionada = (this.opcaoSelecionada + 1) % Object.keys(this.opcoes).length;
                break;
            case '0':
                this.opcaoSelecionada = 0;
                break;
            case '1':
                this.opcaoSelecionada = 1;
                break;
            case '2':
                this.opcaoSelecionada = 2;
                break;
            case '3':   
                this.opcaoSelecionada = 3;
                break;
            case '4':
                this.opcaoSelecionada = 4;
                break;
            case '5':
                this.opcaoSelecionada = 5;
                break;
            case '6':
                this.opcaoSelecionada = 6;
                break;
            case '7':
                this.opcaoSelecionada = 7;
                break;
            case '8':
                this.opcaoSelecionada = 8;
                break;
            case '9':
                this.opcaoSelecionada = 9;
                break;
            case '\r': // Enter
                if (this.#callbackSelecionarOpcao) {
                    LogService.getInstace().debug(`Opção selecionada: ${this.opcaoSelecionada}`);
                    this.#callbackSelecionarOpcao(this.opcaoSelecionada);
                }
                break;
        }
        this.DesenharOpcoes();
    }
}
