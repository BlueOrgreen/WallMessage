
import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, TreeParent, TreeChildren } from 'typeorm';
import { WallEntity } from './wall.entity';

@Exclude()
@Entity('content_comments')
export class CommentEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ comment: "头像路径", nullable: true, })
  avatorUrl?: string

  @Expose()
  @Column({ comment: "用户名", nullable: true, })
  name?: string

  @Expose()
  @Column({ comment: '评论者ID', nullable: true, })
  userId?: string;

  @Expose()
  @Column({ comment: "时间", nullable: true, })
  moment: Date

  @Expose()
  @Column({ comment: '评论内容' })
  comment: string

  @Expose()
  depth = 0;

  @Expose()
  @ManyToOne(() => WallEntity, (wall) => wall.comments, {
     // 文章不能为空
     nullable: false,
     // 跟随父表删除与更新
     onDelete: 'CASCADE',
     onUpdate: 'CASCADE',
  })
  wall: WallEntity

  @TreeParent({ onDelete: 'CASCADE' })
  parent: CommentEntity | null;

  @Expose()
  @TreeChildren({ cascade: true })
  children: CommentEntity[];
}