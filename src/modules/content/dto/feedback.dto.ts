import {
    IsDefined,
    IsEnum,
    IsUUID,
    IsOptional,
} from 'class-validator';
import { ListQueryDto } from '@/modules/restful/dtos';

import { DtoValidation } from '@/modules/core/decorators';
import { IsDataExist } from '@/modules/database/constraints';
import { WallEntity } from '../entities';
import { FeedBackType } from '../constants';
// import { PickType } from '@nestjs/swagger';

/**
 * 评论添加验证
 */
@DtoValidation()
export class CreateFeedBackDto {
  @IsDataExist(WallEntity, { message: '所属的信息不存在' })
  @IsUUID(undefined, { message: 'ID格式错误' })
  wall!: string;

  @IsEnum(FeedBackType)
  @IsDefined({ message: '反馈类型必须指定' })
  feedbackType!: FeedBackType;
}

/**
 * 树查询
 */
// @DtoValidation({ type: 'query' })
// export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['wall']) {}



/**
 * 评论分页查询验证
 */
@DtoValidation({ type: "query" })
export class QueryFeedBackDto extends ListQueryDto {
  // @IsDataExist(WallEntity, {
  //   message: '所属的信息不存在',
  // })
  @IsDataExist(WallEntity, { message: '所属的信息不存在' })
  @IsUUID(undefined, { message: 'ID格式错误' })
  @IsOptional()
  wall?: number;

  // @Transform(({ value }) => toNumber(value))
  // @Min(1, { message: '当前页必须大于1' })
  // @IsNumber()
  // @IsOptional()
  // page = 1;

  // @Transform(({ value }) => toNumber(value))
  // @Min(1, { message: '每页显示数据必须大于1' })
  // @IsNumber()
  // @IsOptional()
  // limit = 10;
}
// QueryFeedBackDto