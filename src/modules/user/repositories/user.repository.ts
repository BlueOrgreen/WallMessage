// import { BaseRepository } from '@/modules/core/crud';
// import { CustomRepository } from '@/modules/core/decorators';
import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
    protected _qbName = 'user';

    /**
     * 构建基础Query
     */
    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(
            `${this.qbName}.createdAt`,
            'DESC',
        );
    }
}
