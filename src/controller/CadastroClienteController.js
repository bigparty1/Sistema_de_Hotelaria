import { CadastroUsuarioView } from "../view/CadastroClienteView.js";
import { EventService } from "../service/EventService.js";
import { LogService } from "../service/logService.js";
import { ClienteService } from "../service/ClienteService.js";
import { NavegacaoController } from "./NavegacaoController.js";
import { MenuController } from "./MenuController.js";

export class CadastroClienteController {
    static identifier = 'CadastroClienteController';
    #cadastroClienteView = null;
    #eventService = null;
    #clienteService = null;
    #navegacaoController = null;

    constructor() {
        this.#cadastroClienteView = new CadastroUsuarioView();
        this.#eventService = EventService.getInstace();
        this.#clienteService = ClienteService.getInstace();
        this.#navegacaoController = NavegacaoController.getInstace();
    }

    destructor() {
        LogService.getInstace().debug('Destruindo CadastroClienteController...');
        this.#cadastroClienteView.destructor();
        this.#eventService.RemoverTodosEventos(CadastroClienteController.identifier);
    }

    async StartAsync() {
        this.#cadastroClienteView.QuandoCancelar(this.Retornar.bind(this));
        this.#cadastroClienteView.QuandoRetornar(this.Retornar.bind(this));
        this.#cadastroClienteView.QuandoSalvarUsuario(this.SalvarUsuario.bind(this));
        this.#cadastroClienteView.Start();

        await new Promise(resolve => {
            this.#eventService.RegistrarEvento(CadastroClienteController.identifier, resolve);
        });
    }

    SalvarUsuario(cliente) {
        try {
            let clienteRetorno = this.#clienteService.adicionarCliente(cliente);
            this.#cadastroClienteView.cliente = clienteRetorno;
        } catch (error) {
            throw new Error(`Erro ao salvar cliente: ${error.message}`);
        }
    }

    Retornar() {
        this.#navegacaoController.DefinirController(MenuController.identifier);
        this.#eventService.EmitirEvento(CadastroClienteController.identifier);
    }
}