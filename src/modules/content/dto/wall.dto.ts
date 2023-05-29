import { PaginateOptions } from "@/modules/database/types";
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  // IsBoolean,
  IsDateString,
  // IsDefined,
  // IsEnum,
  // IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  // IsUUID,
  // MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { toNumber, isNil } from 'lodash';
import { DtoValidation } from '@/modules/core/decorators';
import { WallTypeEnum } from "../constants";


/**
 * 分类分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryWallDto implements PaginateOptions {
  @IsOptional()
  label?: string;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  type = 0

  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: '当前页必须大于1' })
  @IsNumber()
  @IsOptional()
  page = 1;

  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: '每页显示数据必须大于1' })
  @IsNumber()
  @IsOptional()
  limit = 10;
}


/**
 * 信息墙 创建验证
 */
@DtoValidation({ groups: ['create'] })
export class CreateWallDto {
  @MaxLength(96, {
    always: true,
    message: '留言内容最大长度为$',
  })
  // @IsNotEmpty({ groups: ['create'], message: '留言内容必须填写' })
  @IsOptional({ groups: ['update'] })
  message?: string

  @IsOptional({ always: true })
  name?: string

  @IsNotEmpty({ groups: ['create'], message: '类型必须填写' })
  @IsOptional({ groups: ['update'] })
  type: WallTypeEnum

  @IsNotEmpty({ groups: ['create'], message: '用户ID不能为空' })
  @IsOptional({ groups: ['update'] })
  userId: string;

  @IsDateString({ strict: true }, { always: true })
  @IsOptional({ always: true })
  @ValidateIf((value) => {console.log('xxx', value); return !isNil(value.moment)})
  @Transform(({ value }) => (value === 'null' ? null : value))
  moment?: Date;

  @IsOptional({ always: true })
  label?: string

  @IsOptional({ always: true })
  imgUrl?: string

  @IsOptional({ always: true })
  color?: string
}