export const enumValue = <T extends { value: unknown }>(token: T): T['value'] => token.value
