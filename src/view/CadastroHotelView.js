import Hotel from "../model/hotel.js";
import { ConsoleService } from "../service/ConsoleService.js";

export class CadastroHotelView {
    static identifier = 'CadastroHotelView';
    #consoleService = null;
    #quandoSalvarHotelFunc = null;
    #quandoCancelarFunc = null;
    #quandoRetornarFunc = null;
    hotel = null;
    #finalizado = false;
    #campoAtual = 1;
    #campos = {
        0: 'Id:                                        ',
        1: 'Nome:                                      ',
        2: 'Cidade:                                    ',
        3: 'Endereço:                                  ',
        4: 'Telefone:                                  ',
        5: 'Email:                                     ',
        6: 'Qtd. Quartos:                              '
    }

    constructor() {
        this.hotel = new Hotel('', '', '', '', '', '', '');
        this.#consoleService = ConsoleService.getInstace();          
    }

    destructor() {
        this.#consoleService.RemoveResizeEvent(CadastroHotelView.identifier);
        this.#consoleService.RemoveKeyPressEvent(CadastroHotelView.identifier);
        this.#consoleService.habilitarCursor();
        this.#consoleService.limpaTela();

    }

    QuandoSalvarHotel(funcao) {
        this.#quandoSalvarHotelFunc = funcao;
    }

    QuandoCancelar(funcao) {
        this.#quandoCancelarFunc = funcao;
    }

    QuandoRetornar(funcao) {
        this.#quandoRetornarFunc = funcao;
    }

    Start() {
        this.#consoleService.RegisterResizeEvent(CadastroHotelView.identifier, this.DesenharCadastroHotel.bind(this));
        this.#consoleService.RegisterKeyPressEvent(CadastroHotelView.identifier, this.TratamentoEntrada.bind(this));
        this.DesenharCadastroHotel();
    }

    DesenharCadastroHotel() {
        // Limpa a tela
        this.#consoleService.limpaTela();

        // Print Titulo
        this.#consoleService.gotoxy(1, 1);
        this.#consoleService.print(
            this.#consoleService.centralizarTexto('Sistema de Hotelaria - Cadastro Hotel', this.#consoleService.larguraTela), 
            this.#consoleService.CoresTexto.CIANO, 
            this.#consoleService.CoresFundo.MAGENTA
        );

        // Print das entradas
        this.DesenharEntradas();

        // Print Rodape de instruções
        if(this.#finalizado) {
            this.#consoleService.gotoxy(1, this.#consoleService.alturaTela);
            this.#consoleService.print(
                this.#consoleService.centralizarTexto('Hotel salvo com sucesso! Pressione ENTER para prosseguir', this.#consoleService.larguraTela), 
                this.#consoleService.CoresTexto.PRETO, 
                this.#consoleService.CoresFundo.BRANCO
            );
        } else {
            this.#consoleService.gotoxy(1, this.#consoleService.alturaTela);
            this.#consoleService.print(
                this.#consoleService.centralizarTexto('Pressione ENTER para cadastrar o hotel | ESC para cancelar', this.#consoleService.larguraTela), 
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
            let indexDoisPontos = this.#campos[i].indexOf(':');
            let textoCampo = this.#campos[i].substring(0, indexDoisPontos + 1);
            switch (i) {
                case 0:
                    textoCampo += ' ' + this.hotel.hotelId;
                    break;
                case 1:
                    textoCampo += ' ' + this.hotel.nome;
                    break;
                case 2:
                    textoCampo += ' ' + this.hotel.cidade;
                    break;
                case 3:
                    textoCampo += ' ' + this.hotel.endereco;
                    break;
                case 4:
                    textoCampo += ' ' + this.hotel.telefone;
                    break;
                case 5:
                    textoCampo += ' ' + this.hotel.email;
                    break;
                case 6:
                    textoCampo += ' ' + this.hotel.quartos;
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
        let colunaAtual = this.#consoleService
                            .centralizarTexto(this.#campos[this.#campoAtual], this.#consoleService.larguraTela)
                            .indexOf(':') + 3;

        switch (this.#campoAtual) {
            case 0:
                throw new Error('Campo não deveria ser selecionavel!');
            case 1:
                if (this.hotel.nome) {
                    colunaAtual += this.hotel.nome.length;
                }
                break;
            case 2:
                if (this.hotel.cidade) {
                    colunaAtual += this.hotel.cidade.length;
                }
                break;
            case 3:
                if (this.hotel.endereco) {
                    colunaAtual += this.hotel.endereco.length;
                }
                break;
            case 4:
                if (this.hotel.telefone) {
                    colunaAtual += this.hotel.telefone.length;
                }
                break;
            case 5:
                if (this.hotel.email) {
                    colunaAtual += this.hotel.email.length;
                }
                break;
            case 6:
                if (this.hotel.quartos) {
                    colunaAtual += this.hotel.quartos.length;
                }
                break;
            default:
                throw new Error('Campo não identificado!');
        }
        this.#consoleService.gotoxy(colunaAtual, linhaAtual);
    }

    TratamentoEntrada(tecla) {
        switch (tecla) {
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
                        this.hotel.nome = this.hotel.nome.slice(0, -1);
                        colunaAtual += this.hotel.nome.length;
                        break;
                    case 2:
                        this.hotel.cidade = this.hotel.cidade.slice(0, -1);
                        colunaAtual += this.hotel.cidade.length;
                        break;
                    case 3:
                        this.hotel.endereco = this.hotel.endereco.slice(0, -1);
                        colunaAtual += this.hotel.endereco.length;
                        break;
                    case 4:
                        this.hotel.telefone = this.hotel.telefone.slice(0, -1);
                        colunaAtual += this.hotel.telefone.length;
                        break;
                    case 5:
                        this.hotel.email = this.hotel.email.slice(0, -1);
                        colunaAtual += this.hotel.email.length;
                        break;
                    case 6:
                        this.hotel.quartos = this.hotel.quartos.slice(0, -1);
                        colunaAtual += this.hotel.quartos.length;
                        break;
                    default:
                        throw new Error('Campo não identificado!');
                }

                this.#consoleService.gotoxy(colunaAtual, linhaAtual);
                this.#consoleService.print(' ');
                break;

            case '\r': // Enter
                if(this.#finalizado) {
                    this.#quandoRetornarFunc();
                } else {
                    this.#quandoSalvarHotelFunc(this.hotel);
                    this.#finalizado = true;
                    this.#consoleService.desabilitarCursor();
                    this.DesenharCadastroHotel();
                }
                break;

            case '\x1b': // ESC
                this.#quandoCancelarFunc();
                break;

            default:
                if (/^[\p{L}\p{N}\p{P}\p{Z}\p{M}]+$/u.test(tecla)) {
                    this.#consoleService.print(tecla);
                    switch (this.#campoAtual) {
                        case 1:
                            this.hotel.nome += tecla;
                            break;
                        case 2:
                            this.hotel.cidade += tecla;
                            break;
                        case 3:
                            this.hotel.endereco += tecla;
                            break;
                        case 4:
                            this.hotel.telefone += tecla;
                            break;
                        case 5:
                            this.hotel.email += tecla;
                            break;
                        case 6:
                            this.hotel.quartos += tecla;
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