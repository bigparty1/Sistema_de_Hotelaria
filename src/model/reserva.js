export default class Reserva {
    constructor(reservaId, clienteId, hotelId, data, dataEntrada, dataSaida, status) {
        this.reservaId = reservaId;
        this.clienteId = clienteId;
        this.hotelId = hotelId;
        this.data = data;
        this.dataEntrada = dataEntrada;
        this.dataSaida = dataSaida;
        this.status = status;
    }
}   

export class ReservaStatus {
    static PENDENTE = 'Pendente';
    static CONFIRMADA = 'Confirmada';
    static CANCELADA = 'Cancelada';
    static CHECKIN = 'Check-in';
    static CHECKOUT = 'Check-out';    
}
