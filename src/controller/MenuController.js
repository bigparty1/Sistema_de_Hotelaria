import { MenuView } from "../view/MenuView.js";
import { NavegacaoController } from "./NavegacaoController.js";
import { EventService } from "../service/EventService.js";
import { LogService } from "../service/logService.js";
import { CadastroClienteController } from "./CadastroClienteController.js";
import { CadastroHotelController } from "./CadastroHotelController.js";

export class MenuController {
    static identifier = 'MenuController';
    #menuView = null;
    #eventService = null;

    constructor() {
        this.#menuView = new MenuView();
        this.#eventService = EventService.getInstace();
        this.#menuView.QuandoSelecionarOpcao(this.QuandoSelecionarOpcao.bind(this));
    }

    destructor() {
        LogService.getInstace().debug('Destruindo MenuController...');
        this.#menuView.destructor();
        this.#eventService.RemoverTodosEventos(MenuController.identifier);
    }

    async StartAsync() {
        this.#menuView.Start();
        await new Promise(resolve => {
            this.#eventService.RegistrarEvento(MenuController.identifier, resolve);
        });
    }

    QuandoSelecionarOpcao(opcao) {

        let identificadorOpcao = '';

        switch (opcao) {
            case 0:
                throw new Error('Opção não implementada!');
            case 1:
                identificadorOpcao = CadastroHotelController.identifier;
                break;
            case 2:
                throw new Error('Opção não implementada!');
            case 3:
                identificadorOpcao = CadastroClienteController.identifier;
                break;    
            case 4:
                throw new Error('Opção não implementada!');
            case 5:
                throw new Error('Opção não implementada!');
            case 6:
                throw new Error('Opção não implementada!');
            case 7:
                throw new Error('Opção não implementada!');
            case 8:
                throw new Error('Opção não implementada!');
            case 9:
                identificadorOpcao = NavegacaoController.sairIdentifier;
                break;
            default:
                break;
        }

        LogService.getInstace().debug(`Opção selecionada: ${opcao}`);
        LogService.getInstace().debug(`Opção selecionada: ${identificadorOpcao}`);

        this.#eventService.EmitirEvento(NavegacaoController.identifier, identificadorOpcao);
        this.#eventService.EmitirEvento(MenuController.identifier);
    }
}