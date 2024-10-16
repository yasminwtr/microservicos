# Instruções para Execução do Projeto

Para rodar o projeto, siga os passos abaixo:

## Pré-requisitos

Certifique-se de que o Docker esteja instalado em sua máquina.

## Executando o Projeto

1. No terminal, execute o seguinte comando para criar estruturas de banco de dados (Postgres) e sistema de mensageria (RabbitMQ):

```bash
  docker-compose up --build
```

2. Em seguida, suba os serviços separadamente

- Para o serviço de pagamento:
```bash
  cd payment-service
  npm install
  node src/index.js
```

## Testando as Requisições

Após iniciar os serviços, você pode testar as requisições usando o Postman por exemplo.

### Processar Pagamento:

- **Método:** `POST`  
- **URL:** `http://localhost:3000/process-payment`  
- **Body (raw):**

  ```json
  {
    "userId": "1",
    "amount": 100
  }
  ```

### Confirmar Pagamento:

- **Método:** `POST`  
- **URL:** `http://localhost:3000/confirm-payment`  
- **Body (raw):**

  ```json
  {
    "transactionId": "ID da transação que foi retornado no POST anterior."
  }
  ```


