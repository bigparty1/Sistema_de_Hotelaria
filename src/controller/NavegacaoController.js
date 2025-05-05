import { MenuController } from "./MenuController.js";
import { EventService } from "../service/EventService.js";
import { LogService } from "../service/logService.js";

export class NavegacaoController {
    static identifier = 'NavegacaoController';
    static sairIdentifier = 'ControleSaida';
    static #instace = new NavegacaoController();
    #eventService = null;
    #currentController = null;
    #controlerIdentifier = MenuController.identifier;

    constructor() {
        this.#eventService = EventService.getInstace();
    }

    destructor() {
        LogService.getInstace().debug('Destruindo NavegacaoController...');
        this.#eventService.RemoverTodosEventos(NavegacaoController.identifier);
    }

    static getInstace() {
        return this.#instace;
    }

    async StartAsync() {
        this.#eventService.RegistrarEvento(NavegacaoController.identifier, this.DefinirController.bind(this));
        await this.MainLoop();
    }

    DefinirController(controlerIdentifier) {
        LogService.getInstace().debug(`Definindo controller identifier: ${controlerIdentifier} | Controller identifier atual: ${this.#controlerIdentifier}`);
        this.#controlerIdentifier = controlerIdentifier;
    }

    async MainLoop() {
        let continuar = true;
        
        while (continuar) {

            if(this.#currentController) {
                this.#currentController.destructor();
                this.#currentController = null;
            }

            switch (this.#controlerIdentifier) {
                case MenuController.identifier:
                    LogService.getInstace().debug('Navegando para MenuController...');
                    this.#currentController = new MenuController();
                    break;

                case NavegacaoController.sairIdentifier:
                    LogService.getInstace().debug('Navegando para saída...');
                    continuar = false;
                    break;
                
                default:
                    throw new Error('Controller não identificado');
            }
            
            if(this.#currentController){
                await this.#currentController.StartAsync();
            }
        }

        LogService.getInstace().debug('Saindo do loop principal...');
    }
}