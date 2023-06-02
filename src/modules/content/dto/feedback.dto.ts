import {
    IsDefined,
    IsEnum,
    IsUUID,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsDataExist } from '@/modules/database/constraints';
import { WallEntity } from '../entities';
import { FeedBackType } from '../constants';

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