import { describe, afterEach, test, expect, vi } from 'vitest';
import {
  delay,
  retryAsyncFunction,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('Misc Helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('delay', () => {
    test('can delay the execution of a function for any number of seconds', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      delay(10).then(mockFn);
      expect(mockFn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(5000);
      expect(mockFn).not.toHaveBeenCalled();


      await vi.advanceTimersByTimeAsync(6000);
      expect(mockFn).toHaveBeenCalledOnce();
    });
  });

  describe('retryAsyncFunction', () => {
    test('can invoke a function persistently until its out of attempts (w/ delay)', async () => {
      vi.useFakeTimers();
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      retryAsyncFunction(fn, undefined, [3, 5]);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(fn).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(2100);
      expect(fn).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(5500);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('can invoke a function persistently until its out of attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('This is an error!'));
      await expect(retryAsyncFunction(fn, undefined, [0, 0])).rejects.toThrowError('This is an error!');
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
      expect(fn).toHaveBeenNthCalledWith(3);
    });

    test('can invoke a function persistently until its out of attempts with args', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('This is an error!'));
      const args = ['abc', 1, true, [1, 2], { foo: 'bar' }];
      await expect(retryAsyncFunction(fn, args, [0, 0, 0])).rejects.toThrowError('This is an error!');
      expect(fn).toHaveBeenNthCalledWith(1, ...args);
      expect(fn).toHaveBeenNthCalledWith(2, ...args);
      expect(fn).toHaveBeenNthCalledWith(3, ...args);
      expect(fn).toHaveBeenNthCalledWith(4, ...args);
    });

    test('can invoke a function persistently until it resolves', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      await expect(retryAsyncFunction(fn, undefined, [0, 0])).resolves.toBeUndefined();
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
      expect(fn).toHaveBeenNthCalledWith(3);
    });

    test('can invoke a function persistently until it resolves a value', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce('Hello World!');
      await expect(retryAsyncFunction(fn, undefined, [0, 0])).resolves.toBe('Hello World!');
      expect(fn).toHaveBeenNthCalledWith(1);
      expect(fn).toHaveBeenNthCalledWith(2);
    });

    test('can invoke a function persistently until it resolves with args', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockRejectedValueOnce(new Error('This is an error!'))
        .mockResolvedValueOnce(undefined);
      const args = ['abc', 1, true, [1, 2], { foo: 'bar' }];
      await expect(retryAsyncFunction(fn, args, [0, 0])).resolves.toBeUndefined();
      expect(fn).toHaveBeenNthCalledWith(1, ...args);
      expect(fn).toHaveBeenNthCalledWith(2, ...args);
      expect(fn).toHaveBeenNthCalledWith(3, ...args);
    });
  });
});
