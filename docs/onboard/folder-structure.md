# Project Folder Structure

?> Author: Jimmy Lan, Date Created: 2021-05-09, Last Updated: 2021-05-09

---

> In this article, we will discuss the folders that you may find in this project.
> We will explore:
>
> - [Folders in the Top-Most Level](#folders-in-the-top-most-level)
> - [The Config Folder](#the-config-folder)
> - [The Errors Folder](#the-errors-folder)
> - [Middlewares, Routes, and Models Folder](#middlewares-routes-and-models-folder)
> - [The Services Folder](#the-services-folder)
> - [The Types Folder](#the-types-folder)

## Folders in the Top-Most Level

We will talk about three folders at the top-most level in this project: `src`, `docs`, and `test`.

The `src` folder hosts code relating to the business logic of the server.
In production, only code found in the `src` folder runs.
You will find all features of the server inside this folder.

The `test` folder contains unit tests which give us some confidence about our code correctness.
The `test` folder contains sub-directories corresponding to each feature on the server.
A `common.ts` helper file can also be found in the `test` folder.
This file provides utilities that are shared across the testing of varies features.

?> **Tips:** In a Poly Team project, you will find different requirements on test coverages.
Although the test coverage of your code is usually determined by some continuous integration processes in remote, you can run `npm run testc` locally to have _an estimation_ about your test coverage.

The `docs` folder is where we host major documentation about the project.
GitHub will automatically deploy changes pushed into this folder so that our documentation site can be up-to-date.

Some folders are automatically generated as you run some of the `npm` commands.
For example, the `dist` folder will be used to host compiled test-script files.
For another example, the `coverage` folder will host a local report after you run the command to check test coverage.
These folders are included in the `.gitignore` file.
Please do not check them into `git`.

## The Config Folder

Inside of `src`, you will find a `config` folder.
This folder contains files that export configuration objects. The server will then use these configuration objects to run.
When creating a new configuration file, please don't forget to register it in `src/config/index.ts`.

## The Errors Folder

Inside of `src`, you will find an `errors` folder.
This folder contains varies errors which can be thrown inside the server code.
You might recall some code that looks like the following:

```typescript
import { NotFoundError } from "./NotFoundError";
// ...
throw new NotFoundError();
```

or

```typescript
import { NotFoundError } from "./NotFoundError";
// ...
throw new NotFoundError("User requested is not found.");
```

?> **Tips:** We have error handlers set up so that these errors will be caught and parsed. The error handler will send an appropriate response to the client when these pre-defined errors are thrown.

You can define new types of error inside this folder by extending the class `HttpError`.
You can read more in `src/errors/HttpError.ts` about how to extend this class.
Please don't forget to register your file(s) in `src/errors/index.ts`.

## Middlewares, Routes, and Models Folder

Inside the `src` folder, you will find the `middlewares`, `routes`, and `models` folder.
These are standard folders that you can expect in a node-express project.
In Poly Team projects, we tend to embed controllers inside the `routes` folder.
We encourage you to present one route per file and group relevant files in a folder.

## The Services Folder

The `services` folder found in `src` serves as a gateway between this application and its dependencies.
Instead of directly using some services inside of controllers, we wrap them inside wrapper files. This allows us to refactor our code in an easier manner.

## The Types Folder

The `types` folder found in the `src` folder contains type declarations.
These declarations are typically shared across multiple files.
We encourage you to **only** use this folder when a type is shared across files.
Otherwise, please keep your types local in the corresponding file.
