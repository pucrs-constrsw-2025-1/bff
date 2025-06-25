# BFF (Backend for Frontend) Service

Este é o serviço BFF (Backend for Frontend) do projeto ConstrSW, responsável por agregar e orquestrar chamadas para os diversos microserviços backend.

## Funcionalidades

- **Proxy para Microserviços**: Roteia requisições para os serviços backend apropriados
- **Autenticação**: Middleware de autenticação para todas as rotas
- **CORS**: Configuração de CORS para o frontend
- **Actuator**: Endpoints de monitoramento e health check

## Endpoints Disponíveis

### Proxies para Microserviços
- `/classes/*` → Classes Service
- `/courses/*` → Courses Service  
- `/lessons/*` → Lessons Service
- `/professors/*` → Professors Service
- `/reservations/*` → Reservations Service
- `/resources/*` → Resources Service
- `/rooms/*` → Rooms Service
- `/students/*` → Students Service

### Health Checks
- `GET /health` - Health check básico (legado)
- `GET /actuator/health` - Health check completo do Actuator
- `GET /actuator/health/liveness` - Liveness probe
- `GET /actuator/health/readiness` - Readiness probe

### Monitoramento
- `GET /actuator/info` - Informações da aplicação
- `GET /actuator/metrics` - Métricas da aplicação
- `GET /actuator/env` - Informações do ambiente
- `GET /actuator/mappings` - Mapeamento dos endpoints
- `GET /actuator/services` - Status dos serviços backend

## Configuração

O serviço utiliza variáveis de ambiente para configurar as conexões com os microserviços:

- `BFF_INTERNAL_API_PORT`: Porta interna do BFF
- `FRONTEND_EXTERNAL_*`: Configurações do frontend para CORS
- `*_INTERNAL_PROTOCOL`, `*_INTERNAL_HOST`, `*_INTERNAL_API_PORT`: Configurações dos microserviços

## Dependências

- `express`: ^4.18.2
- `express-actuator`: ^1.8.4
- `http-proxy-middleware`: ^3.0.5
- `cors`: ^2.8.5
- `axios`: ^1.7.2

## Documentação do Actuator

Para mais detalhes sobre a implementação do Actuator, consulte [ACTUATOR_README.md](./ACTUATOR_README.md).