export default class Avaliacao {
    constructor(avaliacaoId, reservaId, nota, comentario) {
        this.id = id;
        this.idReserva = idReserva;
        this.nota = nota;
        this.comentario = comentario;
    }
}

export class AvaliacaoNota {
    static UM = 1;
    static DOIS = 2;
    static TRES = 3;
    static QUATRO = 4;
    static CINCO = 5;
}