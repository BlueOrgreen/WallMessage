import { CustomRepository } from '@/modules/database/decorators';
import { FeedBackEntity } from '../entities';
import { Repository } from 'typeorm';

@CustomRepository(FeedBackEntity)
export class FeedBackRepository extends Repository<FeedBackEntity> {
  buildBaseQB() {
    return this.createQueryBuilder('feedback')
    .leftJoinAndSelect('feedback.wall', 'wall')
  }
}
