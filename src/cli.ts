import chalk from 'chalk'
import meow from 'meow'

import {generatePassword} from './generator'

const DEFAULT_LENGTH = 12

export function run(): void {
    const cli = meow(
        `
    Usage
      $ generate-password [length]

    Options
      --length, -l  Length of the password (default: 12)

    Examples
      $ generate-password
      $ generate-password 16
      $ generate-password -l 20
  `,
        {
            importMeta: import.meta,
            flags: {
                length: {
                    type: 'number',
                    shortFlag: 'l',
                    default: 12,
                },
            },
        },
    )

    const length = cli.input[0] ? parseInt(cli.input[0], 10) : cli.flags.length || DEFAULT_LENGTH

    if (isNaN(length) || length < 8) {
        // eslint-disable-next-line no-console
        console.error(chalk.red('Error: Password length must be at least 8 characters.'))
        return process.exit(1)
    }

    const password = generatePassword(length)

    // eslint-disable-next-line no-console
    console.log(chalk.green('Generated password:'))
    // eslint-disable-next-line no-console
    console.log(chalk.blue(password))
}
