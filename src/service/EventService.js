/**
 * @author Kauê Gomes
 * @file EventService.js
 * @module EventService
 * @requires events
 */

import {EventEmitter} from 'events';
import { LogService } from './logService.js';

/**
 * @singleton @class EventService
 * @description Serviço para registrar e emitir eventos personalizados.
 */
export class EventService extends EventEmitter {
    static #instace = new EventService();
    
    constructor() {
        super();
    }

    static getInstace() {
        return this.#instace;
    }

    RegistrarEvento(nomeEvento, callback) {
        LogService.getInstace().debug(`Registrando evento: ${nomeEvento}`);
        this.on(nomeEvento, callback);
    }

    EmitirEvento(nomeEvento, ...args) {
        LogService.getInstace().debug(`Emitindo evento: ${nomeEvento} | args: ${args}`);
        this.emit(nomeEvento, ...args);
    }

    RemoverEvento(nomeEvento, callback) {
        LogService.getInstace().debug(`Removendo evento: ${nomeEvento}`);
        this.off(nomeEvento, callback);
    }

    RemoverTodosEventos(nomeEvento) {
        this.removeAllListeners(nomeEvento);
    }
}