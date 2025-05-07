import fs from 'fs';

export class ClienteService {
    static #instace = new ClienteService();
    #filePath = process.cwd() + '/data/clientes.json';
    #clientes = [];
    #ultimoId = 0;

    constructor() {
        this.#carregarClientesDoArquivo();
        if (this.#clientes.length > 0) {
            this.#ultimoId = Math.max(...this.#clientes.map(cliente => cliente.clienteId));
        }
    }

    static getInstace() {
        return this.#instace;
    }

    #carregarClientesDoArquivo() {
        try {
            if (!fs.existsSync(this.#filePath)) {
                fs.writeFileSync(this.#filePath, JSON.stringify([], null, 2));
            }
            const data = fs.readFileSync(this.#filePath, 'utf8');
            this.#clientes = JSON.parse(data);
        } catch (error) {
            throw new Error(`Erro ao carregar clientes: ${error.message} | Arquivo: ${this.#filePath}`);
        }
    }

    #salvarClientesNoArquivo() {
        try {
            fs.writeFileSync(this.#filePath, JSON.stringify(this.#clientes, null, 2));
        } catch (error) {
            throw new Error(`Erro ao salvar clientes: ${error.message}`);
        }
    }

    adicionarCliente(cliente) {
        cliente.clienteId = ++this.#ultimoId;
        this.#clientes.push(cliente);
        this.#salvarClientesNoArquivo();
        return cliente;
    }

    listarClientes() {
        return this.#clientes;
    }

    buscarClientePorId(clienteId) {
        return this.#clientes.find(cliente => cliente.clienteId === clienteId);
    }

    buscarClientePorNome(nome) {
        return this.#clientes.filter(cliente => cliente.nome.toLowerCase().includes(nome.toLowerCase()));
    }

    atualizarCliente(clienteId, clienteAtualizado) {
        const index = this.#clientes.findIndex(cliente => cliente.clienteId === clienteId);
        if (index !== -1) {
            this.#clientes[index] = { ...this.#clientes[index], ...clienteAtualizado };
            this.#salvarClientesNoArquivo();
        } else {
            throw new Error('Cliente não encontrado');
        }
    }
}