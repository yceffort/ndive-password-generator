import {describe, test, expect} from 'vitest'

import {generatePassword, charset, MIN_PASSWORD_LENGTH} from './generator.js'

describe('generatePassword', () => {
    test('should generate a password of the specified length', () => {
        const length = 12
        const password = generatePassword(length)
        expect(password.length).toBe(length)
    })

    test('should generate passwords using only allowed characters', () => {
        const password = generatePassword(1000)
        const isOnlyAllowedChars = password.split('').every((char) => charset.includes(char))
        expect(isOnlyAllowedChars).toBe(true)
    })

    test('should generate different passwords on subsequent calls', () => {
        const password1 = generatePassword(1000)
        const password2 = generatePassword(1000)
        expect(password1).not.toBe(password2)
    })

    test(`should throw an error if length is less than ${MIN_PASSWORD_LENGTH}`, () => {
        expect(() => generatePassword(0)).toThrow()
    })
})
