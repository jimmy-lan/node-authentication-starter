# Authentication API

?> Author: Jimmy Lan, Date Created: 2021-05-03, Last Updated: 2021-05-03

---

> In this article, we will list information relating to authentication routes.
> We will explore:
>
> - [List of Authentication Endpoints](#list-of-authentication-endpoints)
> - [Special Headers for Authentication](#special-headers-for-authentication)

## List of Authentication Endpoints

Prefix: `/api/v<version_number>/users`

| Path            | Method | Function                     | Request Body                         | Request Header |
| --------------- | ------ | ---------------------------- | ------------------------------------ | -------------- |
| /signin         | POST   | Sign In                      | email, password                      | -              |
| /signup         | POST   | Sign Up                      | email, password, firstName, lastName | -              |
| /current        | GET    | Check current signed-in user | -                                    | auth headers\* |
| /reset-password | POST   | Request password reset       | email                                | -              |

\* **auth headers**: Refers to a set of authentication headers required as proof-of-identity. Please see [Special Headers for Authentication](#special-headers-for-authentication) for more information.

## Special Headers for Authentication

### Information

To access protected resources on the server, users must supply a set of special headers as proof of identity.
These special headers are `authorization` and `x-refresh-token` (not case-sensitive).
The values for these headers must have the formats:

- **Authorization**: [token type] [token string]. Note that token type must be in lowercase and there is exactly one space between token type and token string.

- **X-Refresh-Token**: [token string].

The `authorization` field is reserved for access tokens, and the `x-refresh-token` field is used for refresh tokens.
When an access token becomes invalid, our server will attempt to use the refresh token supplied in the header to generate a new access token for the user.

### Example

We use [JSON web tokens](https://jwt.io) for access and refresh purposes.
A JSON web token contains three sub-parts, separated by commas.
You can read more about JSON web tokens on the [official documentation](https://jwt.io/introduction).

An example entry for the `authorization` header will resemble the following:

> bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI2MDkxYzlhNmQ4YzFlMDU1Y2ZkYWI2OTgifSwiaWF0IjoxNjIwMTY3MDc4ODIyLCJkYXRhIjp7InJvbGUiOiJtZW1iZXIifSwiZXhwIjoxNjIwMTY3Mzc4ODIyfQ.mB-ATuyuqAMRODuyKCqgcQPiGOovZUemQA52EYqacbCdGTlRxy2xtehoC7MbU-TOqblZnCkWVuOnwsUHEPbXHw
