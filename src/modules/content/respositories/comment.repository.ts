import { isNil } from 'lodash';
import {
    // TreeRepository,
    SelectQueryBuilder,
    FindTreeOptions,
    // FindOptionsUtils,
    // TreeRepositoryUtils,
} from 'typeorm';

import { BaseTreeRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';
import { QueryParams } from '@/modules/database/types';

import { CommentEntity } from '../entities';

// type FindCommentTreeOptions = FindTreeOptions & {
//     addQuery?: (query: SelectQueryBuilder<CommentEntity>) => SelectQueryBuilder<CommentEntity>;
// };

@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity> {
    protected _qbName = 'comment';

    protected orderBy = 'createdAt';

    buildBaseQB(
        qb: SelectQueryBuilder<CommentEntity>,
    ): SelectQueryBuilder<CommentEntity> {
        return super
            .buildBaseQB(qb)
            .leftJoinAndSelect(`${this.qbName}.post`, 'post');
    }

    async findTrees(
        options: FindTreeOptions &
            QueryParams<CommentEntity> & { post?: string } = {},
    ): Promise<CommentEntity[]> {
        return super.findTrees({
            ...options,
            addQuery: async (qb) => {
                return isNil(options.post)
                    ? qb
                    : qb.where('post.id = :id', { id: options.post });
            },
        });
    }
}
