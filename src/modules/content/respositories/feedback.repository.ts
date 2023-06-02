import { CustomRepository } from '@/modules/database/decorators';
import { FeedBackEntity } from '../entities';
import { BaseRepository } from '@/modules/database/base';


@CustomRepository(FeedBackEntity)
export class FeedBackRepository extends BaseRepository<FeedBackEntity> {
  protected _qbName = 'feedback';

  buildBaseQB() {
    return this.createQueryBuilder(this.qbName)
    .leftJoinAndSelect(`${this.qbName}.wall`, 'wall')
  }
}
