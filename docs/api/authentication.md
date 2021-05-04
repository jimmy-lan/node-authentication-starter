# Authentication API

?> Author: Jimmy Lan, Date Created: 2021-05-03, Last Updated: 2021-05-03

---

> In this article, we will list information relating to authentication routes.

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
