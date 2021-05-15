# Authentication API

?> Author: Jimmy Lan, Date Created: 2021-05-03, Last Updated: 2021-05-10

---

> In this article, we will list information relating to authentication routes.
> We will explore:
>
> - [List of Authentication Endpoints](#list-of-authentication-endpoints)
> - [Special Headers for Authentication](#special-headers-for-authentication)

## List of Authentication Endpoints

Prefix: `/api/v<version_number>/users`

| Path                   | Method | Function                         | Request Body                         | Request Header |
| ---------------------- | ------ | -------------------------------- | ------------------------------------ | -------------- |
| /signin                | POST   | Sign In                          | email, password                      | -              |
| /signup                | POST   | Sign Up                          | email, password, firstName, lastName | -              |
| /current               | GET    | Check current signed-in user     | -                                    | auth headers\* |
| /reset-password        | POST   | Request password reset           | email                                | -              |
| /reset-password/:token | POST   | Complete password reset          | newPassword                          | -              |
| /sign-out              | POST   | Revoke all issued refresh tokens | -                                    | auth headers\* |

\* **auth headers**: Refers to a set of authentication headers required as proof-of-identity. Please see [Special Headers for Authentication](#special-headers-for-authentication) for more information.

## Special Headers for Authentication

### Request Headers

To access protected resources on the server, users must supply a set of special headers as proof of identity.
These special headers are `authorization` and `x-refresh-token` (not case-sensitive).
The values for these headers must have the formats:

- **Authorization**: [token type] [token string]. Note that token type must be in lowercase and there is exactly one space between token type and token string.

- **X-Refresh-Token**: refresh [token string].

The `authorization` field is reserved for access tokens, and the `x-refresh-token` field is used for refresh tokens.
When an access token becomes invalid, our server will attempt to use the refresh token supplied in the header to generate a new access token for the user.

#### Example

We use [JSON web tokens](https://jwt.io) for access and refresh purposes.
A JSON web token contains three sub-parts, separated by commas.
You can read more about JSON web tokens on the [official documentation](https://jwt.io/introduction).

An example entry for the `authorization` header will resemble the following:

```
bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI2MDkxYzlhNmQ4YzFlMDU1Y2ZkYWI2OTgifSwiaWF0IjoxNjIwMTY3MDc4ODIyLCJkYXRhIjp7InJvbGUiOiJtZW1iZXIifSwiZXhwIjoxNjIwMTY3Mzc4ODIyfQ.mB-ATuyuqAMRODuyKCqgcQPiGOovZUemQA52EYqacbCdGTlRxy2xtehoC7MbU-TOqblZnCkWVuOnwsUHEPbXHw
```

### Response Headers

The server will attempt to use the refresh token provided in `x-refresh-token` to generate a new access token whenever the token in `authorization` expires.
If `x-refresh-token` is not provided or invalid, the authentication fails and returns immediately.
Otherwise, the server will attach the new access token in `x-access-token` response header.
A new refresh token will also be generated.
This new refresh token can be found in the `x-refresh-token` response header.

Please be sure to update the front-end so that the new access and refresh tokens are stored and used on the subsequent requests.
Please note that the operation of generating new tokens are subject to a low rate-limit threshold.
This means, if you fail to store the new tokens and continue to use the expired ones, the server will attempt to generate new tokens on every request.
As a result, your client will start to receive **429 - Rate Limited** errors very quickly.

?> **Tips:** The access token can expire at any time. It is considered best practices having some universal logic on the front-end to handle these response headers.
