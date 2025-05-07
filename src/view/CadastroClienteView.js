import { ConsoleService } from "../service/ConsoleService.js";
import { LogService } from "../service/logService.js";

export class CadastroUsuarioView {
    static identifier = 'CadastroUsuarioView';
    #consoleService = null;
    cliente = null;
    #campoAtual = 1;
    #campos = {
        0: 'Id:                                              ',
        1: 'Nome*:                                           ',
        2: 'Telefone*:                                       ',
        3: 'CPF*:                                            ',
        4: 'Email:                                           ',
    }

    #quandoSalvarFunc = null;
    #quandoRetornarFunc = null;
    #quandoCancelarFunc = null;
    #Finalizado = false; 

    constructor() {
        this.#consoleService = ConsoleService.getInstance();
        this.cliente = {
            clienteId: '',
            nome: '',
            telefone: '',
            cpf: '',
            email: ''
        };
    }

    destructor() {
        this.#consoleService.RemoveResizeEvent(CadastroUsuarioView.identifier);
        this.#consoleService.RemoveKeyPressEvent(CadastroUsuarioView.identifier);
        this.#consoleService.habilitarCursor();
        this.#consoleService.limpaTela();
    }

    QuandoSalvarUsuario(func) {
        this.#quandoSalvarFunc = func;
    }

    QuandoRetornar(func) {
        this.#quandoRetornarFunc = func;
    }

    QuandoCancelar(func) {
        this.#quandoCancelarFunc = func;
    }

    Start() {
        this.#consoleService.RegisterResizeEvent(CadastroUsuarioView.identifier, this.DesenharCadastroCliente.bind(this));
        this.#consoleService.RegisterKeyPressEvent(CadastroUsuarioView.identifier, this.TratamentoEntrada.bind(this));
        this.DesenharCadastroCliente();
    }

    DesenharCadastroCliente() {
        // Limpa a tela
        this.#consoleService.limpaTela();
        
        // Print Titulo
        this.#consoleService.gotoxy(1, 1);
        this.#consoleService.print(
            this.#consoleService.centralizarTexto('Sistema de Hotelaria - Cadastro Cliente', this.#consoleService.larguraTela), 
            this.#consoleService.CoresTexto.CIANO, 
            this.#consoleService.CoresFundo.MAGENTA
        );

        // Print das entradas
        this.DesenharEntradas();

        // Print Rodape de instruções
        if(this.#Finalizado) {
            this.#consoleService.gotoxy(1, this.#consoleService.alturaTela);
            this.#consoleService.print(
                this.#consoleService.centralizarTexto('Cliente salvo com sucesso! Pressione ENTER para prosseguir', this.#consoleService.larguraTela), 
                this.#consoleService.CoresTexto.PRETO, 
                this.#consoleService.CoresFundo.BRANCO
            );
        } else {
            this.#consoleService.gotoxy(1, this.#consoleService.alturaTela);
            this.#consoleService.print(
                this.#consoleService.centralizarTexto('Pressione ENTER para cadastrar o cliente | ESC para cancelar', this.#consoleService.larguraTela), 
                this.#consoleService.CoresTexto.PRETO, 
                this.#consoleService.CoresFundo.BRANCO
            );
        }
        

        // Posiciona cursor na linha e coluna correta
        this.PosicionarCursor();
    }

    DesenharEntradas() {
        let linhaImpressao = Math.floor((this.#consoleService.alturaTela - Object.keys(this.#campos).length) / 2);
        for (let i = 0; i < Object.keys(this.#campos).length; i++) {
            this.#consoleService.gotoxy(1, linhaImpressao++);
            let textoCampo = String(this.#campos[i]).replace(/ /g, '');
            switch (i) {
                case 0:
                    textoCampo += ' ' + this.cliente.clienteId;
                    break;
                case 1:
                    textoCampo += ' ' + this.cliente.nome;
                    break;
                case 2:
                    textoCampo += ' ' + this.cliente.telefone;
                    break;
                case 3:
                    textoCampo += ' ' + this.cliente.cpf;
                    break;
                case 4:
                    textoCampo += ' ' + this.cliente.email;
                    break;
                default:
                    throw new Error('Campo não identificado!');
            }
            if(textoCampo.length < this.#campos[i].length) {
                textoCampo += ' '.repeat(this.#campos[i].length - textoCampo.length);
            }
            this.#consoleService.print(
                this.#consoleService.centralizarTexto(textoCampo, this.#consoleService.larguraTela)
            )
        }
    }

    PosicionarCursor() {
        const linhaAtual = Math.floor((this.#consoleService.alturaTela - Object.keys(this.#campos).length) / 2) + this.#campoAtual;
        LogService.getInstace().debug(`Linha atual: ${linhaAtual}`);
        let colunaAtual = this.#consoleService
                            .centralizarTexto(this.#campos[this.#campoAtual], this.#consoleService.larguraTela)
                            .indexOf(':') + 3;

        switch (this.#campoAtual) {
            case 0:
                throw new Error('Campo não deveria ser selecionavel!');
            case 1:
                if (this.cliente.nome) {
                    colunaAtual += this.cliente.nome.length;
                }
                break;
            case 2:
                if (this.cliente.telefone) {
                    colunaAtual += this.cliente.telefone.length;
                }
                break;
            case 3:
                if (this.cliente.cpf) {
                    colunaAtual += this.cliente.cpf.length;
                }
                break;
            case 4:
                if (this.cliente.email) {
                    colunaAtual += this.cliente.email.length;
                }
                break;
            default:
                throw new Error('Campo não identificado!');
        }

        LogService.getInstace().debug(`Campo atual: ${this.#campoAtual} | Linha atual: ${linhaAtual} | Coluna atual: ${colunaAtual}`);

        this.#consoleService.gotoxy(colunaAtual, linhaAtual);
    }

    TratamentoEntrada(key) {
        
        LogService.getInstace().debug(`Tecla pressionada: ${JSON.stringify(key)}`);
        
        switch (key) {
            case '\x1b[A': // seta para cima
            case '\x1b[Z': // Shift + tab
                this.#campoAtual = (this.#campoAtual - 1 + Object.keys(this.#campos).length) % Object.keys(this.#campos).length;
                if(this.#campoAtual === 0) {
                    this.#campoAtual = 1;
                }
                break;
            case '\x1b[B': // seta para baixo
            case '\t': // Tab
                this.#campoAtual = (this.#campoAtual + 1) % Object.keys(this.#campos).length;
                if(this.#campoAtual === 0) {
                    this.#campoAtual = Object.keys(this.#campos).length -1;
                }
                break;
            case '\b': // backspace
            let linhaAtual = Math.floor((this.#consoleService.alturaTela - Object.keys(this.#campos).length) / 2) + this.#campoAtual;
            let colunaAtual = this.#consoleService
                                .centralizarTexto(this.#campos[this.#campoAtual], this.#consoleService.larguraTela)
                                .indexOf(':') + 3;            

                switch (this.#campoAtual) {
                    case 1:
                        this.cliente.nome = this.cliente.nome.slice(0, -1);
                        colunaAtual += this.cliente.nome.length;
                        break;
                    case 2:
                        this.cliente.telefone = this.cliente.telefone.slice(0, -1);
                        colunaAtual += this.cliente.telefone.length;
                        break;
                    case 3:
                        this.cliente.cpf = this.cliente.cpf.slice(0, -1);
                        colunaAtual += this.cliente.cpf.length;
                        break;
                    case 4:
                        this.cliente.email = this.cliente.email.slice(0, -1);
                        colunaAtual += this.cliente.email.length;
                        break;
                    default:
                        throw new Error('Campo não identificado!');
                }

                this.#consoleService.gotoxy(colunaAtual, linhaAtual);
                this.#consoleService.print(' ');
                break;

            case '\r': // Enter
                if(this.#Finalizado) {
                    this.#quandoRetornarFunc();
                } else {
                    this.#quandoSalvarFunc(this.cliente);
                    this.#Finalizado = true;
                    this.#consoleService.desabilitarCursor();
                    this.DesenharCadastroCliente();
                }
                break;

            case '\x1b': // ESC
                this.#quandoCancelarFunc();
                break;

            default:
                if (/^[\p{L}\p{N}\p{P}\p{Z}\p{M}]+$/u.test(key)) {
                    this.#consoleService.print(key);
                    switch (this.#campoAtual) {
                        case 1:
                            this.cliente.nome += key;
                            break;
                        case 2:
                            this.cliente.telefone += key;
                            break;
                        case 3:
                            this.cliente.cpf += key;
                            break;
                        case 4:
                            this.cliente.email += key;
                            break;
                        default:
                            throw new Error('Campo não identificado!');
                    }
                }
                break;
        }

        this.PosicionarCursor();
    }
}