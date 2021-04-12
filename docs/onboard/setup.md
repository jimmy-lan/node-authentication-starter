# Project Setup Guide

?> Author: Jimmy Lan, Date Created: 2021-03-12, Last Updated: 2021-04-11

---

> In this article, we will address three ways to run a local copy of this project.
> We will explore:
> 
> * [Run Project Locally](#run-project-locally)
> * [Run Project with Docker](#run-project-with-docker)
> * [Run Project with Docker-compose](#run-project-with-docker-compose)

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

In this section, we will run the web server alone in a container using Docker.

<strike>At the current stage, I have not added separate docker files for Redis and Mongo DB.
It is currently unclear whether I should add this feature to the project.
Therefore, we are not able to use `docker-compose` just yet.</strike>

**Updated April 11, 2021:**
A `docker-compose.yml` file can be found at the root of the project repository.
It contains instructions to set up the web server, nginx, mongo db, and redis.
You may choose to uncomment the sections for nginx and mongo db based on your needs.
Please refer to [Run Project with Docker-compose](#run-project-with-docker-compose) for more information.

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

## Run Project with Docker-compose

You can find a file named `docker-compose.yml` from the root folder of this project.
Edit the file to suite your needs, then run:

```bash
docker-compose up
```

### A Note to Container-Optimized OS

If you are using a container-optimized OS (for example, a container in the [cos-cloud](https://cloud.google.com/container-optimized-os/docs) project), you may not be able to install `docker-compose` directly.
A work-around is to run `docker-compose` from Docker.

For example, use the following command to download and run a `docker-compose` image:
```bash
docker run docker/compose:1.24.0 version
```

We can then run the project using the following command as an alternative to `docker-compose up`:
```bash
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0 up
```

?> **Tips:** Please consult the documentation written by a Google employee for more information: https://cloud.google.com/community/tutorials/docker-compose-on-container-optimized-os.

To make future dev-ops work easier, we recommend you to register an alias for the long command above, as follows:
```bash
echo alias docker-compose="'"'docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$PWD:$PWD" \
    -w="$PWD" \
    docker/compose:1.24.0'"'" >> ~/.bashrc && source ~/.bashrc
```

Now you can run `docker-compose up` normally.
