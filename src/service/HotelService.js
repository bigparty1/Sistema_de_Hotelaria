import fs from 'fs';

export class HotelService {
    static #instace = new HotelService();
    #filePath = process.cwd() + '/data/hoteis.json';
    #hoteis = [];
    #ultimoId = 0;

    constructor() {
        this.#carregarHoteisDoArquivo();
        if (this.#hoteis.length > 0) {
            this.#ultimoId = Math.max(...this.#hoteis.map(hotel => hotel.hotelId));
        }
    }

    static getInstace() {
        return this.#instace;
    }

    #carregarHoteisDoArquivo() {
        try {
            if (!fs.existsSync(this.#filePath)) {
                fs.writeFileSync(this.#filePath, JSON.stringify([], null, 2));
            }
            const data = fs.readFileSync(this.#filePath, 'utf8');
            this.#hoteis = JSON.parse(data);
        } catch (error) {
            throw new Error(`Erro ao carregar hoteis: ${error.message} | Arquivo: ${this.#filePath}`);
        }
    }

    #salvarHoteisNoArquivo() {
        try {
            fs.writeFileSync(this.#filePath, JSON.stringify(this.#hoteis, null, 2));
        } catch (error) {
            throw new Error(`Erro ao salvar hoteis: ${error.message}`);
        }
    }

    adicionarHotel(hotel) {
        hotel.hotelId = ++this.#ultimoId;
        this.#hoteis.push(hotel);
        this.#salvarHoteisNoArquivo();
        return hotel;
    }

    listarHoteis() {
        return this.#hoteis;
    }

    buscarHotelPorId(hotelId) {
        return this.#hoteis.find(hotel => hotel.hotelId === hotelId);
    }

    buscarHotelPorNome(nome) {
        return this.#hoteis.filter(hotel => hotel.nome.toLowerCase().includes(nome.toLowerCase()));
    }
}