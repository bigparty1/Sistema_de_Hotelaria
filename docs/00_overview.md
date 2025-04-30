# Sistema de Hotelaria - Visão Geral do Projeto

Arquivo de visão geral do projeto e definição de requisitos.

## Descrição
Sistema para gestão de hotéis e reservas, desenvolvido como um sistema de terminal (CLI - Command Line Interface). O objetivo é permitir o gerenciamento de hotéis, clientes e reservas de forma simples e eficiente.

## Funcionalidades
- Cadastro de hotéis
- Cadastro de clientes
- Cadastro de reservas
- Consulta de hotéis
- Consulta de clientes
- Consulta de reservas
- Confirmação de chegada (check-in)
- Confirmação de saída (check-out)
- Cancelamento de reservas
- Relatório de ocupação de hotéis
- Sistema de avaliação de hotéis

## Regras de Negócio
- Um cliente pode ter várias reservas.
- Um hotel pode ter várias reservas.
- Uma reserva pertence a um cliente e a um hotel.
- Um hotel só pode aceitar reservas se houver disponibilidade de quartos.
- O check-in só pode ser realizado na data de início da reserva.
- O check-out só pode ser realizado após o check-in.
- Reservas canceladas não podem ser reativadas.

## Tecnologias
- **JavaScript**: Linguagem de programação utilizada para o desenvolvimento do sistema.
- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **JSON**: Formato de intercâmbio de dados leve e fácil de ler, utilizado para armazenar os dados do sistema.
- **MVC**: Modelo de arquitetura de software que separa a aplicação em três componentes principais: Modelo, Visão e Controlador.
- Os dados serão mocados (ou seja, não serão persistidos em banco de dados), mas sim armazenados em sistemas simples de arquivos JSON.
- O sistema será de terminal (CLI - Command Line Interface).

## Estrutura de Arquivos
- **src/**: Contém o código-fonte do sistema.
  - **controller/**: Controladores responsáveis por gerenciar a interação entre a visão e o modelo. Eles processam as entradas do usuário e atualizam a visão. 
  - **model/**: Modelos de dados que representam as entidades do sistema, como Hotel, Cliente e Reserva.
  - **service/**: Serviços responsáveis por funcionalidades específicas, como manipulação de dados, lógica de negócios e abstrações de exibição.
  - **view/**: Interfaces de usuário que exibem informações e solicitam entradas do usuário. Elas são responsáveis por apresentar os dados de forma amigável.
- **docs/**: Documentação do projeto.
- **data/**: Arquivos JSON para armazenamento de dados mocados.
- **tests/**: Testes unitários e de integração.