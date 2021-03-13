# Project Setup Guide

?> Author: Jimmy Lan, Date Created: 2021-03-12, Last Updated: 2021-03-12

---

> In this article, we will address two ways to run a local copy of this project.
> We will explore:
> 
> * [Run Project Locally](#run-project-locally)
> * [Run Project with Docker](#run-project-with-docker)

## Run Project Locally

### Install Dependencies

After cloning the project, run
```bash
npm install
```

### Add Environment Variables

Make a copy of the file `.env.example`. 
Name it exactly as `.env`.
Look in to the file and change the variables to your liking.
In particular, please provide a connection string to your Mongo DB, and a connection string to Redis.

If you choose to run the databases locally on your machine for the purpose of development, simply paste in the value `mongodb://localhost:27017` for Mongo DB and `redis://localhost:6379` for Redis.

To give you some context, we use Mongo DB to store the main data values for this project.
We use Redis to store temporary values, for example, data related to our rate limiting implementation.

### Make Sure Your Databases are Started

If you run Mongo DB or Redis, or both, on your local machine, please make sure to start the services before going to the next step.

?> Usually, we run the command `mongod` to start a local copy of Mongo DB, and `redis-server` to start Redis.

### Run the Server

Run
```bash
npm run dev
```

to start a development server which auto-reloads whenever the code changes.

Alternatively, you may do this manually.
If you run
```bash
npm run build
```

then, the Typescript code will be compiled to Javascript and stored in the `dist` folder.
You may then run 
```bash
npm start
```

to start the server using the code in the `dist` directory.

Note that the `npm start` method do not rebuild the project on code change.

## Run Project with Docker

At the current stage, I have not added separate docker files for Redis and Mongo DB.
It is currently unclear whether I should add this feature to the project.
Therefore, we are not able to use `docker-compose` just yet.

Right now, you can set up the server in a docker container, while running Mongo DB and Redis somewhere else.

### Build and Tag

Run the following command **from the root** of this repository:

```bash
docker build -t lanyanxi/node-auth . -f dev.Dockerfile
```

### Start the Container

To start the server, use:

```bash
docker run -p 5000:5000 -it lanyanxi/node-auth
```

or you may run the container in detach mode:

```bash
docker run -dp 5000:5000 -it lanyanxi/node-auth
```

Be sure to pass in the environment variables and change the port if you decide to use a different one.
