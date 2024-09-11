export const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

export function generatePassword(length: number): string {
    if (length < 1) {
        throw new Error('Password length must be at least 1')
    }

    let password = ''
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)]
    }
    return password
}
