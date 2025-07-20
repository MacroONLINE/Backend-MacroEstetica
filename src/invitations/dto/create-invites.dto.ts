import { IsArray, IsEmail } from 'class-validator'

export class CreateInvitesDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[]
}
