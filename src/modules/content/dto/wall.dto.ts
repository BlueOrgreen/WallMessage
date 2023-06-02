// import { PaginateOptions } from "@/modules/database/types";
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  // IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  // IsNotEmpty,
  // IsNumber,
  IsOptional,
  MaxLength,
  IsUUID,
  // MaxLength,
  // Min,
  ValidateIf,
} from 'class-validator';
import { isNil } from 'lodash';
import { DtoValidation } from '@/modules/core/decorators';
import { WallTypeEnum, PostOrderType } from "../constants";
import { PartialType } from "@nestjs/swagger";
import { ListWithTrashedQueryDto } from "@/modules/restful/dtos";


/**
 * 分类分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryWallDto extends ListWithTrashedQueryDto {
  @IsEnum(PostOrderType, {
    message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
  })
  @IsOptional()
  orderBy?: PostOrderType;
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
  @IsNotEmpty({ groups: ['create'], message: '留言内容必须填写' })
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

/**
 * 文章更新验证
 */
@DtoValidation({ groups: ['update'] })
export class UpdateWallDto extends PartialType(CreateWallDto) {
  @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
  @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
  id!: string;
}