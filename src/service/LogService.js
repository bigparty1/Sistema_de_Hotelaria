import fileSystem from 'fs';

export class LogService {

    static #instace = new LogService();
    #logFilePath = process.cwd() + '/log.txt';
    #debugFilePath = process.cwd() + '/debug.txt';

    static getInstace() {
        return this.#instace;
    }

    #PegarQuemCHamou() {
        const stack = new Error().stack.split('\n')[3].trim();
        const match = stack.match(/at (.+) \((.+):(\d+):(\d+)\)/);
        if (match) {
            return match[1];
        }
        return 'Desconhecido';
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}\n`;
        fileSystem.appendFileSync(this.#logFilePath, logMessage);
    }

    debug(message) {
        if(process.env.DEBUG === 'true'){
            const timestamp = new Date().toISOString();
            const logMessage = `${timestamp} - ${this.#PegarQuemCHamou()} - ${message}\n`;
            fileSystem.appendFileSync(this.#debugFilePath, logMessage);
        }
    }
}