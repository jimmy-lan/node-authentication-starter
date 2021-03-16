/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 */

const rateLimiter = {
  consume: jest.fn(),
  get: jest.fn().mockImplementation(() => {
    return {
      msBeforeNext: 0, // Number of milliseconds before next action can be done
      remainingPoints: 1, // Number of remaining points in current duration
      consumedPoints: 5, // Number of consumed points in current duration
      isFirstInDuration: false, // action is first in current duration
    };
  }),
  delete: jest.fn(),
};

export const tokenRefreshRateLimiter = rateLimiter;
export const userRequestRateLimiter = rateLimiter;
export const ipRateLimiter = rateLimiter;
export const signInRateLimiter = rateLimiter;
export const passwordResetRateLimiter = rateLimiter;
export const authBruteIPRateLimiter = rateLimiter;
