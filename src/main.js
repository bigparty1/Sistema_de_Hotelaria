import { NavegacaoController } from "./controller/NavegacaoController.js"

(async () => {
    const navegacaoController = NavegacaoController.getInstace();
    await navegacaoController.StartAsync();
})();


