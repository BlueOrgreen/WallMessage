import {
    IsDefined,
    IsEnum,
    IsNumber,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
// import { IsDataExist } from '@/modules/database/constraints';
// import { WallEntity } from '../entities';
import { FeedBackType } from '../constants';

/**
 * 评论添加验证
 */
@DtoValidation()
export class CreateFeedBackDto {
  // @IsDataExist(WallEntity, { message: '指定的主体不存在' })
  @IsNumber(undefined, { message: '文章ID格式错误' })
  wall!: number;

  @IsEnum(FeedBackType)
  @IsDefined({ message: '反馈类型必须指定' })
  feedbackType!: FeedBackType;
}