import {describe, it, expect} from 'vitest'

// src/generator.test.ts
import {generatePassword, charset} from './generator.js'

describe('generatePassword', () => {
    it('should generate a password of the specified length', () => {
        const length = 12
        const password = generatePassword(length)
        expect(password.length).toBe(length)
    })

    it('should generate passwords using only allowed characters', () => {
        const password = generatePassword(1000)
        const isOnlyAllowedChars = password.split('').every((char) => charset.includes(char))
        expect(isOnlyAllowedChars).toBe(true)
    })

    it('should generate different passwords on subsequent calls', () => {
        const password1 = generatePassword(1000)
        const password2 = generatePassword(1000)
        expect(password1).not.toBe(password2)
    })

    it('should throw an error if length is less than 1', () => {
        expect(() => generatePassword(0)).toThrow('Password length must be at least 1')
    })

    it('should generate passwords with all character types over multiple attempts', () => {
        const charTypes = {
            lowercase: /[a-z]/,
            uppercase: /[A-Z]/,
            digit: /[0-9]/,
            special: new RegExp(`[${charset.replace(/[a-zA-Z0-9]/g, '')}]`),
        }

        const attempts = 1000
        const results = Object.fromEntries(Object.keys(charTypes).map((type) => [type, false]))

        for (let i = 0; i < attempts; i++) {
            const password = generatePassword(50) // 20자 비밀번호 생성
            Object.entries(charTypes).forEach(([type, regex]) => {
                if (regex.test(password)) {
                    results[type] = true
                }
            })

            // 모든 문자 유형이 발견되면 조기 종료
            if (Object.values(results).every(Boolean)) {
                break
            }
        }

        Object.entries(results).forEach(([type, included]) => {
            expect(included).toBe(true)
            // eslint-disable-next-line no-console
            console.log(`${type}: ${included ? 'included' : 'not included'} in the passwords`)
        })
    })

    it('should have a relatively even distribution of characters', () => {
        const sampleSize = 100000
        const passwords = Array.from({length: 100}, () => generatePassword(1000))

        const charCounts = Object.fromEntries(charset.split('').map((char) => [char, 0]))

        passwords.forEach((password) => {
            password.split('').forEach((char) => {
                charCounts[char]++
            })
        })

        const totalChars = sampleSize
        const expectedPercentage = 100 / charset.length
        const allowedDeviation = 0.5 // 0.5% deviation allowed

        Object.entries(charCounts).forEach(([_, count]) => {
            const percentage = (count / totalChars) * 100
            expect(percentage).toBeGreaterThanOrEqual(expectedPercentage - allowedDeviation)
            expect(percentage).toBeLessThanOrEqual(expectedPercentage + allowedDeviation)
        })
    })

    it('should pass chi-square test for uniform distribution', () => {
        const password = generatePassword(10000)
        const observed = Object.fromEntries(charset.split('').map((char) => [char, 0]))

        password.split('').forEach((char) => {
            observed[char]++
        })

        const expected = password.length / charset.length
        const chiSquare = Object.values(observed).reduce(
            (sum, count) => sum + Math.pow(count - expected, 2) / expected,
            0,
        )
        const degreesOfFreedom = charset.length - 1
        const criticalValue = calculateChiSquareCriticalValue(degreesOfFreedom)

        //  eslint-disable-next-line no-console
        console.log(`Chi-square statistic: ${chiSquare}`)
        expect(chiSquare).toBeLessThan(criticalValue)
    })
})

// This is a simplified approximation of the chi-square critical value.
// For more accurate values, you might want to use a statistical library.
function calculateChiSquareCriticalValue(df: number): number {
    // This approximation is reasonable for df > 30
    return df + Math.sqrt(2 * df) * 1.645 // 1.645 is the z-score for 95% confidence
}
