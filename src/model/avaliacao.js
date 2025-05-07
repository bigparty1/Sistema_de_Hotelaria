export default class Avaliacao {
    constructor(avaliacaoId, reservaId, nota, comentario) {
        this.avaliacaoId = avaliacaoId;
        this.reservaId = reservaId;
        this.nota = nota;
        this.comentario = comentario;
    }
}

export class AvaliacaoNota {
    static ZERO = 0;
    static UM = 1;
    static DOIS = 2;
    static TRES = 3;
    static QUATRO = 4;
    static CINCO = 5;
}