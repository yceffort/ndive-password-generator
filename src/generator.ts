export const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export const MIN_PASSWORD_LENGTH = 8

export function generatePassword(length: number): string {
    if (length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password length must be at least ${MIN_PASSWORD_LENGTH}`)
    }

    let password = ''
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)]
    }
    return password
}
