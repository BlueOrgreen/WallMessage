import { Entity, ManyToOne, OneToOne } from 'typeorm';

import { BaseToken } from './base.token';
import { RefreshTokenEntity } from './refresh-token.entity';
import { UserEntity } from './user.entity';

/**
 * 用户认证token模型
 */
// 用户认证token模型
// 这个模型用于存储用户访问的令牌，供JWT策略判断用户请求中的令牌是否已经失效以及生成新的令牌
// - 此模型与用户多对一关联，同时在删用户除时清空他的全部令牌
// - 此模型与Token刷新模型一对一关联，同时在删除一个accessToken时删除其refreshToken
@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseToken {
    /**
     * @description 关联的刷新令牌
     * @type {RefreshTokenEntity}
     */
    @OneToOne(
        () => RefreshTokenEntity,
        (refreshToken) => refreshToken.accessToken,
        {
            cascade: true,
        },
    )
    refreshToken!: RefreshTokenEntity;

    /**
     * @description 所属用户所属用户所属用户
     * @type {UserEntity}
     */
    @ManyToOne((type) => UserEntity, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user!: UserEntity;
}
