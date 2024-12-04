
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

## Estrutura do Banco de Dados

### Tabelas Criadas

#### Tabela `user`
```sql
CREATE TABLE chat."user" (
    id serial4 NOT NULL,
    "name" text NULL,
    username varchar(100) NULL,
    email varchar(100) NULL,
    "password" text NULL,
    updated_at timestamp NULL,
    created_at timestamp DEFAULT now() NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);
```

#### Tabela `private_messages`
```sql
CREATE TABLE chat.private_messages (
    id serial4 NOT NULL,
    message text NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    from_user_id int4 NOT NULL,
    to_user_id int4 NOT NULL,
    CONSTRAINT private_messages_pkey PRIMARY KEY (id),
    CONSTRAINT unique_message_pair UNIQUE (from_user_id, to_user_id, created_at)
);
CREATE INDEX idx_private_messages_from_user ON chat.private_messages USING btree (from_user_id);
CREATE INDEX idx_private_messages_to_user ON chat.private_messages USING btree (to_user_id);

ALTER TABLE chat.private_messages ADD CONSTRAINT private_messages_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES chat."user"(id);
ALTER TABLE chat.private_messages ADD CONSTRAINT private_messages_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES chat."user"(id);
```

#### Tabela `messages`
```sql
CREATE TABLE chat.messages (
    id serial4 NOT NULL,
    message text NULL,
    created_at timestamp DEFAULT now() NULL,
    user_id int4 NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
);

ALTER TABLE chat.messages ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES chat."user"(id);
```

#### Tabela `blacklist`
```sql
CREATE TABLE chat.blacklist (
    id serial4 NOT NULL,
    jwt text NULL,
    CONSTRAINT blacklist_pkey PRIMARY KEY (id)
);
```

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

4. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as configurações necessárias, como a conexão com o banco de dados, a chave secreta para JWT e a porta que seu app irá rodar.

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

6. Acesse o web app no seu navegador em `http://localhost:3000`.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para enviar issues e pull requests.

