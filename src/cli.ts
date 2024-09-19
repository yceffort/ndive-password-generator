import chalk from 'chalk'
import meow from 'meow'

import {generatePassword, MIN_PASSWORD_LENGTH} from './generator'

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

    /**
     * @description generate-password 10 과 generate-password -l 10 은 같은 결과를 반환한다. 더 편리한 사용을 위해 전자를 지원하며, 두개 모두가 들어올 경우 전자가 우선순위를 갖는다.
     */
    const length = cli.input[0] ? parseInt(cli.input[0], 10) : cli.flags.length || DEFAULT_LENGTH

    if (isNaN(length) || length < MIN_PASSWORD_LENGTH) {
        // eslint-disable-next-line no-console
        console.error(chalk.red(`Error: Password length must be at least ${MIN_PASSWORD_LENGTH} characters.`))
        return process.exit(1)
    }

    const password = generatePassword(length)

    // eslint-disable-next-line no-console
    console.log(chalk.green(`Generated password (${length} characters)`))
    // eslint-disable-next-line no-console
    console.log(chalk.blue(password))
}
