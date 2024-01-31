# Gerenciamento de baldes e macas
Desafio planne

### Dependencias

- docker@24

Nao e necessario instalar node ou qualquer outra ferramenta alem do Docker.

### Como executar o servidor

```
# estando na raiz do projeto, execute:
docker compose up
```

O container do servidor sera criado (Dockerfile) e a aplicacao sera iniciada. Localmente, um diretorio chamado `data` sera criado na raiz do projeto a fim de manter os dados do banco salvos. Esse projeto usa SQLite.

### Como parar o servidor

```
# O servidor ira parar, mas os dados serao persistidos no diretorio `data` local.
# Caso seja executado `docker compose up` novamente, os dados serao restaurados
Ctrl+c
```

### Endpoints

O container está configurado para funcionar na porta `8080` com bridge com o localhost. Os endpoints que podem ser acessados sao:

- http://0.0.0.0:8080/api-docs : Especificacao OpenAPI do projeto
- http://0.0.0.0:8080/api/v1 : Base URL de todas as chamadas para essa API

### Recurso

Nesse projeto foi adicionada uma colecao do Postman chamada `gerenciamento-de-baldes-e-macas.postman_collection.json` que pode ser importada para facilidar no uso.
