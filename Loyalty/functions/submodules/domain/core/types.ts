// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type DTO = { [field: string]: any }

type ResponseResult = { data?: DTO | DTOConvertible; error?: unknown }
