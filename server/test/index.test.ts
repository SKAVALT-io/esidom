//FizzBuzz.test.ts
/// <reference types="jest" />

import {fizzBuzz} from "../src/index";
test("FizzBuzz test", () => {
    expect(fizzBuzz(2)).toBe("1 2 ");
    expect(fizzBuzz(3)).toBe("1 2 Fizz ");
});

import { isInternalLink } from '../src/index'

test('should return false given external link', () => {
  expect(isInternalLink('https://google.com')).toBe(false)
})

test('should return true given internal link', () => {
  expect(isInternalLink('/some-page')).toBe(true)
})

// test('should always fail', () => {
//     expect(isInternalLink('/some-page')).toBe(false)
//   })