# Oeendel's Live Chat

O **Oeendel's Live Chat** é um web app de conversas em tempo real, projetado para facilitar a interação entre pessoas de forma rápida e prática. A plataforma oferece um ambiente para conversar no chat geral, fazer novas amizades, além de possibilitar conversas privadas e em grupo.

## Funcionalidades

- **Chat Geral**: Participe de conversas abertas com todos os usuários do sistema.
- **Conversas Privadas**: Inicie conversas diretas com outros usuários.
- **Grupos**: Crie e participe de grupos de conversa com vários participantes.
- **Notificações em Tempo Real**: Receba novas mensagens instantaneamente.
- **Interface Simples e Intuitiva**: Navegação fácil e acessível.

## Tecnologias Utilizadas

- **Front-end**: HTML5, CSS3, JavaScript puro
- **Back-end**: Node.js com Express
- **WebSockets**: Socket.io para comunicação em tempo real
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)

## Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/oondels/live-chat.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd live-chat
   ```

3. Instale as dependências do backend:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as configurações necessárias, como a conexão com o banco de dados, a chave secreta para JWT e a porta que seu app ira rodar.

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

6. Acesse o web app no seu navegador em `Editar Link`.

## Estrutura do Projeto

- `/public`: Arquivos estáticos como HTML, CSS e JavaScript.
- `/views`: Definição das rotas do backend (organizando as páginas e APIs).
- `/server`: Configuração do backend (\*.js)

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para enviar issues e pull requests.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
