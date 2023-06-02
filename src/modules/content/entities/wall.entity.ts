import { Type, Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { WallTypeEnum } from '../constants';
import { CommentEntity } from './comment.entity';
import { FeedBackEntity } from './feedback.entity';
import { BaseEntity } from '@/modules/database/base';

@Exclude()
@Entity('content_walls')
export class WallEntity extends BaseEntity {
    @Expose()
    @Column({ comment: "类型" })
    type: WallTypeEnum

    @Expose()
    @Column({ comment: "留言" })
    message: string

    @Expose()
    @Column({ comment: "用户名" })
    name: string

    @Expose()
    @Column({ comment: "创建者ID" })
    userId: string

    @Expose()
    @Type(() => Date)
    @Column({
        comment: '创建时间',
        type: 'varchar',
        nullable: true,
    })
    moment?: Date | null;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;

    @Expose()
    @Column({ comment: "标签" })
    label: string

    @Expose()
    @Column({ comment: "颜色", nullable: true, })
    color: string | null;

    @Expose()
    commentCount: number;

    @Expose()
    feedBackCount: number;

    @Expose()
    @Column({ comment: "图片路径", nullable: true, })
    imgUrl: string | null;

    @OneToMany(() => CommentEntity, (comment) => comment.wall, {
      cascade: true,
    })
    comments: CommentEntity[]
    

    // @OneToOne(() => FeedBackEntity)
    // @JoinColumn()
    @OneToMany(() => FeedBackEntity, (feedback) => feedback.wall, {
      cascade: true,
      // eager: true,
    })
    feedbacks: FeedBackEntity[]

}