import { CustomRepository } from '@/modules/database/decorators';
import { CommentEntity, FeedBackEntity, WallEntity } from '../entities';
// import { Repository } from 'typeorm';
import { BaseRepository } from '@/modules/database/base';

@CustomRepository(WallEntity)
export class WallRepository extends BaseRepository<WallEntity> {
  protected _qbName = 'wall';


  buildBaseQB() {
    // 在查询之前先查询出评论数量在添加到commentCount字段上
    return this.createQueryBuilder(this.qbName)
        .leftJoinAndSelect(`${this.qbName}.comments`, 'comments')
        .leftJoinAndSelect(`${this.qbName}.feedbacks`, 'feedbacks')
        .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(c.id)', 'count')
                .from(CommentEntity, 'c')
                .where('c.wall.id = wall.id');
        }, 'commentCount')
        .addSelect((subQuery) => {
          return subQuery
              .select('COUNT(f.id)', 'count')
              .from(FeedBackEntity, 'f')
              .where('f.wall.id = wall.id')
              // .andWhere('f.feedbackType = :feedbackType', { feedbackType: 1 });
      }, 'feedbackCount')
        .loadRelationCountAndMap(`${this.qbName}.commentCount`, `${this.qbName}.comments`)
        .loadRelationCountAndMap(`${this.qbName}.feedBackCount`, `${this.qbName}.feedbacks`);
}

  // buildBaseQB() {
  //   return this.createQueryBuilder('wall')
  //   .leftJoinAndSelect('wall.comments', 'comments')
  //   .leftJoinAndSelect('wall.feedbacks', 'feedbacks')
  //   .addSelect((subQuery) => {
  //     return subQuery.select('COUNT(f.id)', 'count')
  //            .from(FeedBackEntity, 'f')
  //            .where('f.wall.id = wall.id');
  //   }, 'feedbackCount')
  //   .addSelect((subQuery) => {
  //     return subQuery
  //     .select('COUNT(c.id)', 'count')
  //     .from(CommentEntity, 'c')
  //     .where('c.wall.id = wall.id');
  //   }, 'commentCount')
  //   .loadRelationCountAndMap('wall.feedbackCount', 'wall.feedbacks')
  //   .loadRelationCountAndMap('wall.commentCount', 'wall.comments')
  // }
}
