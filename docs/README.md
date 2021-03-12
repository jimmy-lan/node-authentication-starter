# Authentication Server

?> Author: Jimmy Lan, Date Created: 2021-03-12, Last Updated: 2021-03-12

---

## Overview

This repository includes the necessary files to quickly bootstrap a [Node.js](https://nodejs.org/en/) server that has [authentication](https://en.wikipedia.org/wiki/Authentication) functionalities built-in.
The server is capable to perform basic authentication strategy, bearer authentication strategy (through refresh tokens), and [OAuth](https://oauth.net/2/).
[Rate limiting](https://en.wikipedia.org/wiki/Rate_limiting) techniques are also implemented and will be explained in another page of this documentation.
The project uses [Typescript](https://www.typescriptlang.org/) and **is opinionated**.
It is initially meant to serve as a starting point for personal and enterprise [Node.js](https://nodejs.org/en/) projects inside of [Poly Team Solutions](https://github.com/Poly-Team).

## Commands

### Set up project

```bash 
npm install
```

### Start server

```bash
npm start
```

### Automatic rebuilds

```bash
# TS Node Dev
npm run dev
# TSC Watch
npm run watch-ts
```

### Start documentation site
```bash
npm run doc
```

### Run tests
```bash
npm run test
```

Please look at `package.json` for other available scripts.

## Configuration

### Environment variables

A `.env.example` file is provided under the **root directory** to show example environment variables.

However, not all variables are required for the service to run.
You can find a list of required environment variables by looking into the file `src/app.ts`.

Close to the top of the file `src/app.ts`, you will observe an array with the name `requiredVariables`.
This array lists the names of the environment variables that the server depends on.
An error will be thrown, causing the process to halt if one or more of these variables are not defined.

### dotenv

In development mode, I recommend the use of `dotenv` package.
This template has `dotenv` installed as a development dependency, and variables will be drawn from the `.env` file under **development** mode.

A recommended approach to set up the environment variables is to copy the file `.env.example` and rename the copy `.env`, then start changing the values inside the file based on your project needs.

