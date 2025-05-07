import { EventService } from '../service/EventService.js';
import { HotelService } from '../service/HotelService.js';
import { CadastroHotelView } from '../view/CadastroHotelView.js';
import Hotel from '../model/hotel.js';
import { NavegacaoController } from './NavegacaoController.js';
import { MenuController } from './MenuController.js';

export class CadastroHotelController {
    static identifier = 'CadastroHotelController';
    #cadastroHotelView = null;
    #eventService = null;
    #hotelService = null;
    #navegacaoController = null;

    constructor() {
        this.#cadastroHotelView = new CadastroHotelView();
        this.#eventService = EventService.getInstace();
        this.#hotelService = HotelService.getInstace();
        this.#navegacaoController = NavegacaoController.getInstace();
    }

    destructor() {
        this.#cadastroHotelView.destructor();
        this.#eventService.RemoverTodosEventos(CadastroHotelController.identifier);
    }

    async StartAsync() {
        this.#cadastroHotelView.QuandoCancelar(this.Retornar.bind(this));
        this.#cadastroHotelView.QuandoRetornar(this.Retornar.bind(this));
        this.#cadastroHotelView.QuandoSalvarHotel(this.SalvarHotel.bind(this));
        this.#cadastroHotelView.Start();

        await new Promise(resolve => {
            this.#eventService.RegistrarEvento(CadastroHotelController.identifier, resolve);
        });
    }

    SalvarHotel(hotel) {
        try {
            let hotelRetorno = this.#hotelService.adicionarHotel(hotel);
            this.#cadastroHotelView.hotel = hotelRetorno;
        } catch (error) {
            throw new Error(`Erro ao salvar cliente: ${error.message}`);
        }
    }

    Retornar() {
        this.#navegacaoController.DefinirController(MenuController.identifier);
        this.#eventService.EmitirEvento(CadastroHotelController.identifier);
    }

}
