# Debug do Serviço BFF

## Configuração de Debug

O serviço BFF (Backend for Frontend) está configurado para suportar debug remoto via Node.js Inspector.

### Portas de Debug

- **Porta Interna**: 9229 (dentro do container)
- **Porta Externa**: 8290 (mapeada do host)

### Configuração do VS Code

O arquivo `.vscode/launch.json` já está configurado com a seguinte configuração:

```json
{
    "type": "node",
    "name": "BFF Service",
    "request": "attach",
    "port": 8290,
    "address": "localhost",
    "localRoot": "${workspaceFolder}/backend/bff",
    "remoteRoot": "/app",
    "protocol": "inspector",
    "restart": true,
    "sourceMaps": true
}
```

### Como Usar

1. **Iniciar o serviço**:
   ```bash
   docker-compose up -d bff
   ```

2. **Aguardar o serviço estar saudável**:
   ```bash
   docker-compose ps bff
   ```

3. **Conectar o debugger no VS Code**:
   - Abrir a aba "Run and Debug" (Ctrl+Shift+D)
   - Selecionar "BFF Service" na lista
   - Clicar no botão de play (▶️) ou pressionar F5

4. **Definir breakpoints**:
   - Abrir qualquer arquivo JavaScript do projeto em `backend/bff`
   - Clicar na margem esquerda para definir breakpoints
   - Fazer uma requisição para o endpoint desejado

### Endpoints Disponíveis

- **Health Check**: `GET http://localhost:8190/actuator/health`
- **API Base**: `http://localhost:8190`
- **Documentação**: `http://localhost:8190/api-docs`
- **Swagger UI**: `http://localhost:8190/swagger-ui`

### Endpoints Principais

- **Proxy para outros serviços**: `GET/POST/PUT/DELETE http://localhost:8190/api/*`
- **Autenticação**: `POST http://localhost:8190/auth/*`
- **Agregação de dados**: `GET http://localhost:8190/aggregated/*`

### Troubleshooting

#### Problema: "Connection refused"
- Verificar se o container está rodando: `docker-compose ps bff`
- Verificar se a porta 8290 está mapeada: `docker port bff`
- Verificar logs: `docker-compose logs bff`

#### Problema: "Source not found"
- Verificar se o `localRoot` no launch.json está correto
- Verificar se o `remoteRoot` está correto: `/app`
- Verificar se os source maps estão habilitados

#### Problema: Debugger não para nos breakpoints
- Verificar se o breakpoint está definido no arquivo correto
- Verificar se o código está sendo executado (fazer uma requisição HTTP)
- Verificar se não há erros de sintaxe JavaScript

### Configuração do Dockerfile

O Dockerfile está configurado com:

```dockerfile
# Expor porta de debug
EXPOSE 3000 9229

# Configurar Node.js para debug remoto
ENV NODE_OPTIONS="--inspect=0.0.0.0:9229"

CMD ["npm", "start"]
```

### Variáveis de Ambiente

As seguintes variáveis de ambiente são usadas para debug:

- `BFF_INTERNAL_DEBUG_PORT=9229` (porta interna)
- `BFF_EXTERNAL_DEBUG_PORT=8290` (porta externa)
- `BFF_INTERNAL_API_PORT=3000` (porta da API)
- `BFF_EXTERNAL_API_PORT=8190` (porta externa da API)

### Logs de Debug

Para ver logs detalhados do debug:

```bash
docker-compose logs bff | grep -i debug
```

### Reiniciar com Debug

Se precisar reiniciar o serviço com debug:

```bash
docker-compose restart bff
```

### Verificar Status do Debug

Para verificar se o debug está ativo:

```bash
docker exec bff ps aux | grep node
```

Deve mostrar o Node.js com as opções de debug: `--inspect=0.0.0.0:9229`

### Scripts NPM

- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com debug
- `npm test`: Executa os testes

### Dependências

- Node.js 18+
- Express.js
- Swagger UI Express
- CORS
- Helmet
- HTTP Proxy Middleware

### Estrutura do Projeto

```
backend/bff/
├── app.js              # Configuração principal do Express
├── controllers/        # Controladores da API
├── middleware/         # Middlewares customizados
├── routes/            # Definição de rotas
└── package.json       # Dependências e scripts
```

### Funcionalidades do BFF

- **Proxy de Requisições**: Encaminha requisições para os microserviços apropriados
- **Agregação de Dados**: Combina dados de múltiplos serviços
- **Autenticação**: Centraliza a autenticação e autorização
- **Rate Limiting**: Controla a taxa de requisições
- **Caching**: Cache de respostas para melhor performance

### Configuração de Proxy

O BFF está configurado para fazer proxy para os seguintes serviços:

```javascript
// Exemplo de configuração de proxy
app.use('/api/courses', proxy('http://courses:8080'));
app.use('/api/classes', proxy('http://classes:8080'));
app.use('/api/professors', proxy('http://professors:3000'));
```

### Middlewares

- **CORS**: Permite requisições cross-origin
- **Helmet**: Segurança HTTP
- **Body Parser**: Parse de JSON
- **Auth Middleware**: Autenticação de requisições

### Hot Reload

O serviço está configurado com hot reload via `nodemon`:

```json
{
    "scripts": {
        "dev": "nodemon --inspect=0.0.0.0:9229 app.js"
    }
}
```

### Source Maps

Para debug adequado, certifique-se de que os source maps estão habilitados no `package.json`:

```json
{
    "scripts": {
        "start": "node app.js",
        "dev": "nodemon --inspect=0.0.0.0:9229 app.js"
    }
}
``` 