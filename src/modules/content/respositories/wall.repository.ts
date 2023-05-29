import { CustomRepository } from '@/modules/database/decorators';
import { WallEntity } from '../entities';
import { Repository } from 'typeorm';

@CustomRepository(WallEntity)
export class WallRepository extends Repository<WallEntity> {
  buildBaseQB() {
    return this.createQueryBuilder('wall')
    .leftJoinAndSelect('wall.feedbacks', 'feedbacks')
    // .addSelect((subQuery) => {
    //   return subQuery
    //       .select('COUNT(c.id)', 'count')
    //       .from(CommentEntity, 'c')
    //       .where('c.wall.id = wall.id');
    // }, 'commentCount')
    // .loadRelationCountAndMap('wall.commentCount', 'wall.comments')
  }
}
