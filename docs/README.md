# Authentication Server

?> Author: Jimmy Lan, Date Created: 2021-03-12, Last Updated: 2021-05-03

---

> In this article, we will go over some high-level details of this node.js authentication template. If you are currently reading this document on GitHub, please note that you could [read this documentation on our website](https://lanyanxiang.github.io/node-authentication-starter/) for better experience.
> We will explore:
>
> - [Overview](#overview)
> - [License and Contribution Note](#license-and-contribution-note)
> - [Onboard this Project](#onboard-this-project)
> - [Useful Commands](#commands)
> - [Configurations](#configurations)
> - [Next Steps](#next-steps)

## Overview

This repository includes the necessary files to quickly bootstrap a [Node.js](https://nodejs.org/en/) server that has [authentication](https://en.wikipedia.org/wiki/Authentication) functionalities built-in.

The server is capable to perform basic authentication strategy, bearer authentication strategy (through refresh tokens), and [OAuth](https://oauth.net/2/).

[Rate limiting](https://en.wikipedia.org/wiki/Rate_limiting) techniques are also implemented and will be explained in [this page](onboard/rate-limiters.md) of this documentation.

The project uses [Typescript](https://www.typescriptlang.org/) and **is opinionated**.
It is initially meant to serve as a starting point for personal and enterprise [Node.js](https://nodejs.org/en/) projects inside of [Poly Team Solutions](https://github.com/Poly-Team).

## License and Contribution Note

According to the decision made in an internal Poly Team meeting, this repository will become open-source and will be released under GNU General Public License v3.0 starting May 3rd, 2021.
Please find more information in the file named `LICENSE` or `LICENSE.md` in the root repository.

Despite usable, this project is currently under development process.
Due to this, although we decided to make this project open-sourced, we will not accept any contributions (pull requests) from outside of Poly Team Solutions during this time.
This decision may or may not change in the future.
However, you are always free to use or modify this code in your own project(s), if applicable, as long as you follow the terms outlined in the `LICENSE` file described above.

## Onboard this Project

Are you reading this page on GitHub? Consider viewing the documentation from a website for better experience.
Clone this repository and run `npm run doc` to read the documentation locally on your machine.
Alternatively, you can use the following link: https://lanyanxiang.github.io/node-authentication-starter/.

If you don't find the set-up process intuitive enough, please have a look at this [setup guide](./onboard/setup.md).
Joining or extending a project may be a challenging experience for some.
That's why I aim to provide a good documentation so that you can get up to speed regardless of your prior experience.
Please read some more documentation pages in the `onboard` folder in case of need.

## Commands

?> You might need to use the commands below extensively throughout your contribution to this project.
Therefore, I strongly encourage you to become familiar with them as soon as possible.

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
# Run test in regular watch mode
npm run test

# Run test and show test coverage
npm run testc
```

Please look at `package.json` for other available scripts.

## Configurations

### Environment variables

A `.env.example` file is provided under the **root directory** to show example environment variables.

However, not all variables are required for the service to run.
You can find a list of required environment variables by looking into the file `src/index.ts`.

Close to the top of the file `src/index.ts`, you will observe an array with the name `requiredVariables`.
This array lists the names of the environment variables that the server depends on.
An error will be thrown, causing the process to halt if one or more of these variables are not defined.

**For example,**

```
> node-authentication-starter@1.0.0 dev
> ts-node-dev src/index.ts

[INFO] 17:24:09 ts-node-dev ver. 1.1.6 (using ts-node ver. 9.1.1, typescript ver. 4.2.2)
17:24:14 [Server] Missing environment Variables: DB_URI, ACCESS_SECRET, REFRESH_SECRET, REDIS_URI
17:24:14 [Server] Process exiting.
```

### dotenv

In development mode, I recommend the use of `dotenv` package.
This template has `dotenv` installed as a development dependency, and variables will be drawn from the `.env` file under **development** mode.

A recommended approach to set up the environment variables is to copy the file `.env.example` and rename the copy `.env`, then start changing the values inside the file based on your project needs.

## Next Steps

Coming soon
