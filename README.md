# Simple Forum Set-Up (Apollo GraphQL & React)

### 1. Clone repository

```sh
git clone https://github.com/arcbjorn/forum-react-apollo
```

### 2. Install dependencies & Deploy the Prisma database API

```sh
cd react-apollo/server
npm install
npm add prisma
prisma deploy
```

Follow these steps in the CLI :

1. Select **Demo server**
1. **Authenticate** with Prisma Cloud
1. Confirm **all suggested values**

<details>
 <summary>Alternative: Prisma locally via Docker</summary>

1. Docker from [here](https://store.docker.com/search?offering=community&type=edition).
1. Create `docker-compose.yml` for MySQL ( [here](https://www.prisma.io/docs/prisma-server/database-connector-POSTGRES-jgfr/) for Postgres):
    ```yml
    version: '3'
    services:
      prisma:
        image: prismagraphql/prisma:1.23
        restart: always
        ports:
        - "4466:4466"
        environment:
          PRISMA_CONFIG: |
            port: 4466
            databases:
              default:
                connector: mysql
                host: mysql
                port: 3306
                user: root
                password: prisma
                migrations: true
      mysql:
        image: mysql:5.7
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: prisma
        volumes:
          - mysql:/var/lib/mysql
    volumes:
      mysql:
    ```
1. Run `docker-compose up -d`
1. Run `prisma deploy`

</details>

### 3. Start the server

Inside the `server` directory:

```sh
npm start
```

> [GraphQL Playground](https://github.com/prisma/graphql-playground):
[http://localhost:4000](http://localhost:4000).

### 4. Run the app from root directory

```sh
npm install
npm start
```

App on the port:
[http://localhost:3000](http://localhost:3000).

Special thanks to community:
[https://www.howtographql.com](https://www.howtographql.com)
