import { Transform, Type } from 'class-transformer'
import {
  IsString, IsOptional, IsNumber, IsDate,
  IsArray, ArrayUnique, IsEnum
} from 'class-validator'
import { $Enums } from '@prisma/client'

const toArray = <T>(v: T | T[]) =>
  v === undefined || v === null || v === ''
    ? undefined
    : Array.isArray(v) ? v : [v]

export class CreateClassroomDto {
  @IsString() title: string
  @IsString() description: string

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : Number(value))
  @IsNumber()
  price?: number

  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDateTime: Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDateTime: Date

  @IsOptional() @IsString() channelName?: string

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  @IsArray() @ArrayUnique()
  @IsEnum($Enums.Profession, { each: true })
  categories?: $Enums.Profession[]

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  @IsArray() @ArrayUnique()
  @IsString({ each: true })
  oratorIds?: string[]
}
