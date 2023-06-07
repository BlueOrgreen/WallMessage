import { isNil } from 'lodash';

import { EnvironmentType } from '@/modules/database/constants';
import { UserConfig } from '@/modules/user/types';

export const setRunEnv = () => {
    if (
        isNil(process.env.NODE_ENV) ||
        !Object.values(EnvironmentType).includes(
            process.env.NODE_ENV as EnvironmentType,
        )
    ) {
        process.env.NODE_ENV = EnvironmentType.PRODUCTION;
    }
};

export const getRunEnv = (): EnvironmentType => {
    setRunEnv();
    return process.env.NODE_ENV as EnvironmentType;
};

const expiredTime =
    getRunEnv() === EnvironmentType.DEVELOPMENT ? 3600 * 10000 : 3600;

/**
 * 用户模块配置
 */
export const userConfig: () => UserConfig = () => ({
    hash: 10,
    jwt: {
        secret: 'my-secret',
        token_expired: expiredTime,
        refresh_secret: 'my-refresh-secret',
        refresh_token_expired: expiredTime * 30,
    },
});
