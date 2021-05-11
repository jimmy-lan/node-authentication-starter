# Understanding Rate Limiters

?> Author: Jimmy Lan, Date Created: 2021-05-10, Last Updated: 2021-05-10

---

> In this article, we will explore the rate limiting technique used in this project.
> We will explore:
>
> - [Overview of Rate Limiting](#overview-of-rate-limiting)
> - [Bursty Bucket Strategy](#bursty-bucket-strategy)
> - [Rate Limiting Configuration](#rate-limiting-configuration)

## Overview of Rate Limiting

Rate limiting is a technique used to prevent [Denial of Service (DoS)](https://www.paloaltonetworks.com/cyberpedia/what-is-a-denial-of-service-attack-dos) attacks.
By implementing this technique, users will not be able to send many requests in a short amount of time.
The server simply stops processing requests coming from a particular IP, user, or IP/user combination after the rate limit is exceeded.

The most trivial implementation of a rate limiter (i.e., the "standard rate limiter") is to count the number of requests that fall into a particular category during a period.
However, this type of rate limiter does not have the flexibility to accommodate small usage bursts and can decrease user satisfaction if the rate-limiting duration is too small.
Setting a long duration for this type of rate limiter may also be a problem.
For example, consider the following rate limiter settings:

> - Rate limit based on IP addresses.
>
> - Each IP can make 500 requests every 10 minutes.

In this example configuration, a malicious user can still send 500 requests during the first 30 seconds of a 10-minute interval, causing potential server crashes during every 10-minute cycle.

To solve these issues, we typically use more advanced rate-limiting algorithms in production.
Examples of advanced rate-limiting strategies include [token bucket](https://en.wikipedia.org/wiki/Token_bucket), [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket), and [bursty bucket](https://dev.to/animir/token-bucket-vs-bursty-rate-limiter-a5c).
We use bursty buckets in this program.

## Bursty Bucket Strategy

A bursty rate limiter combines two standard rate limiters (i.e., the trivial implementation discussed in the previous section).
One limiter serves to limit standard access of a resource, and the other rate limiter worries about usage peaks.
The limiter concerning usage peaks usually has a longer duration compared to the rate limiter for standard usage.

Combining the two rate limiters, a bursty rate limiter is essentially saying to the client, "You can access this resource X times during an interval of A seconds. Additionally, you can access this resource Y times during an interval of B seconds, where B > A."

Therefore, we can safely set A to a smaller number and B to a larger value.
This accommodates usage peaks **and** prevents request overflow in a portion of the big cycle.

You can read more about the concept of bursty rate limiters here: https://dev.to/animir/token-bucket-vs-bursty-rate-limiter-a5c.
The package that we use for the rate-limiting functionality can be found here: https://www.npmjs.com/package/rate-limiter-flexible.

## Rate Limiting Configuration

You can find configurations relating to the rate limiters in `src/config/rateLimit.ts`.
There are more inline explanations to help you configure the right values for your app.
Please be sure to read the inline comments carefully, as they may provide you with critical intuition.
