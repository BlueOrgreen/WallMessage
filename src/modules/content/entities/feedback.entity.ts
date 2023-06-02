
import { Type, Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { FeedBackType } from "../constants";
import { WallEntity } from './wall.entity';
import { BaseEntity } from '@/modules/database/base';

@Exclude()
@Entity('content_feedbacks')
export class FeedBackEntity extends BaseEntity {
  @Expose()
  @Type(() => Date)
  @CreateDateColumn({ comment: '时间' })
  moment: Date;

  @Expose()
  @Column({ comment: '反馈类型' })
  feedbackType: FeedBackType;

  @Expose()
  @Column({ comment: "创建者ID", nullable: true, })
  userId: string

  @Expose()
  @Column({ comment: "用户名",  nullable: true, })
  name: string

  @Expose()
  @ManyToOne(() => WallEntity, (wall) => wall.feedbacks, {
     // 文章不能为空
     nullable: false,
     // 跟随父表删除与更新
     onDelete: 'CASCADE',
     onUpdate: 'CASCADE',
  })
  wall: WallEntity
}

// createForeignKeyConstraints: false