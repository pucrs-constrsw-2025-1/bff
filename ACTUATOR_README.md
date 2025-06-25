# Actuator para BFF Service

Este serviço implementa um actuator similar ao Spring Boot Actuator usando Node.js/Express + express-actuator.

## Endpoints Disponíveis

### Health Checks
- `GET /actuator/health` - Health check completo com status da aplicação
- `GET /actuator/health/liveness` - Liveness probe (aplicação está viva)
- `GET /actuator/health/readiness` - Readiness probe (aplicação está pronta)

### Métricas
- `GET /actuator/metrics` - Métricas da aplicação
- `GET /actuator/prometheus` - Endpoint alternativo para métricas

### Informações
- `GET /actuator/info` - Informações sobre a aplicação
- `GET /actuator/env` - Informações sobre o ambiente
- `GET /actuator/mappings` - Mapeamento dos endpoints disponíveis

### Endpoints Customizados
- `GET /actuator/services` - Status dos serviços backend conectados

## Health Check Completo (`/actuator/health`)

Retorna o status geral da aplicação BFF, incluindo:
- Status da aplicação
- Informações sobre os serviços backend
- Métricas de performance

## Liveness Probe (`/actuator/health/liveness`)

Verifica se a aplicação está viva e respondendo a requisições.

## Readiness Probe (`/actuator/health/readiness`)

Verifica se a aplicação está pronta para receber tráfego, incluindo:
- Status dos serviços backend
- Disponibilidade dos proxies

## Endpoint Customizado de Serviços (`/actuator/services`)

Retorna informações sobre os serviços backend conectados:
```json
{
  "status": "UP",
  "services": {
    "classes": "http://classes:8080",
    "courses": "http://courses:8080",
    "lessons": "http://lessons:8000",
    "professors": "http://professors:3000",
    "reservations": "http://reservations:8080",
    "resources": "http://resources:8080",
    "rooms": "http://rooms:8080",
    "students": "http://students:8080"
  }
}
```

## Configuração

As configurações do actuator estão integradas ao sistema de configuração existente:

- **Base Path**: `/actuator`
- **Info Mode**: `simple` (informações básicas do git)
- **Custom Endpoints**: Endpoint personalizado para status dos serviços

## Health Check do Docker

O health check do Docker está configurado para usar `/actuator/health`:

```yaml
healthcheck:
  test: [ "CMD-SHELL", "curl -f ${BFF_INTERNAL_PROTOCOL}://${BFF_INTERNAL_HOST}:${BFF_INTERNAL_API_PORT}/actuator/health" ]
  start_period: 90s
  interval: 10s
  timeout: 10s
  retries: 10
```

## Compatibilidade

O endpoint `/health` original foi mantido para compatibilidade com sistemas existentes, mas é recomendado usar `/actuator/health` para novos monitoramentos.

## Dependências

- `express-actuator`: ^1.9.0
- `express`: ^4.18.2

## Arquivos Relacionados

- `app.js`: Configuração principal do actuator
- `package.json`: Dependências do projeto
- `docker-compose.yml`: Configuração do health check 