
# What's Poundcake?

A NodeJS application generator to scaffold new projects.

# Installation

```bash
npm i -g node-poundcake
```

# Usage

To generate a default app:

```bash
node-poundcake -n <dirname>
```

```
📦<dirname>
 ┣ 📂__tests__
 ┣ 📂src
 ┃ ┗ 📜index.js
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.eslintrc
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┗ 📜package.json
```

To generate a **API**:

```bash
node-poundcake -n <dirname> --api
```

```
📦<dirname>
 ┣ 📂__tests__
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📜router.js
 ┃ ┃ ┗ 📜server.js
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜main-controller.js
 ┃ ┗ 📜index.js
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.eslintrc
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┗ 📜package.json
```

To generate a **Typescript** project (all options have TS support):

```bash
node-poundcake -n <dirname> --ts
```

```
📦<dirname>
 ┣ 📂__tests__
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📜router.ts
 ┃ ┃ ┗ 📜server.ts
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜main-controller.ts
 ┃ ┗ 📜index.ts
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.eslintrc
 ┣ 📜Dockerfile
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```

To generate a API with **Mongo** and **RabbitMQ**:

```bash
node-poundcake -n <dirname> --api --mongo --rabbitmq
```

```
📦<dirname>
 ┣ 📂__tests__
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📜router.js
 ┃ ┃ ┗ 📜server.js
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜main-controller.js
 ┃ ┣ 📂models
 ┃ ┃ ┗ 📜contact.js
 ┃ ┣ 📂services
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mongo.js
 ┃ ┃ ┗ 📜rabbitmq.js
 ┃ ┣ 📂subscribers
 ┃ ┗ 📜index.js
 ┣ 📜.dockerignore
 ┣ 📜.editorconfig
 ┣ 📜.eslintrc
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┗ 📜package.json
```

All dependencies will be added on `package.json` according to the options.

# Command Line Options

```bash
# node-poundcake --help
-n, --name <dir>  project directory name
--ts              typescript mode
--api             add express api
--mongo           add mongoose service
--rabbitmq        add amqplib service
-f, --force       remove directory if exists
-h, --help        display help for command
```

# License

[MIT](LICENSE)
