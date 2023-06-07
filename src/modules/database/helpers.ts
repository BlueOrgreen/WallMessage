import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import {
    DataSource,
    ObjectLiteral,
    ObjectType,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';

import { userConfig, appConfig } from '@/config';

import { CUSTOM_REPOSITORY_METADATA, EnvironmentType } from './constants';

import {
    OrderQueryType,
    PaginateOptions,
    PaginateReturn,
    TimeOptions,
} from './types';

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

/**
 * 分页函数
 * @param qb queryBuilder实例
 * @param options 分页选项
 */
export const paginate = async <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    options: PaginateOptions,
): Promise<PaginateReturn<E>> => {
    const start = options.page > 0 ? options.page - 1 : 0;
    const totalItems = await qb.getCount();
    qb.take(options.limit).skip(start * options.limit);
    const items = await qb.getMany();
    const totalPages = Math.ceil(totalItems / options.limit);
    const itemCount =
        // eslint-disable-next-line no-nested-ternary
        options.page < totalPages
            ? options.limit
            : options.page === totalPages
            ? totalItems
            : 0;
    return {
        items,
        meta: {
            totalItems,
            itemCount,
            perPage: options.limit,
            totalPages,
            currentPage: options.page,
        },
    };
};

/**
 * 数据手动分页函数
 * @param options 分页选项
 * @param data 数据列表
 */
export function manualPaginate<E extends ObjectLiteral>(
    options: PaginateOptions,
    data: E[],
): PaginateReturn<E> {
    const { page, limit } = options;
    let items: E[] = [];
    const totalItems = data.length;
    const totalRst = totalItems / limit;
    const totalPages =
        totalRst > Math.floor(totalRst)
            ? Math.floor(totalRst) + 1
            : Math.floor(totalRst);
    let itemCount = 0;
    if (page <= totalPages) {
        itemCount =
            page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
        const start = (page - 1) * limit;
        items = data.slice(start, start + itemCount);
    }
    return {
        meta: {
            itemCount,
            totalItems,
            perPage: limit,
            totalPages,
            currentPage: page,
        },
        items,
    };
}

/**
 * 为查询添加排序,默认排序规则为DESC
 * @param qb 原查询
 * @param alias 别名
 * @param orderBy 查询排序
 */
export const getOrderByQuery = <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    alias: string,
    orderBy?: OrderQueryType,
) => {
    if (isNil(orderBy)) return qb;
    if (typeof orderBy === 'string')
        return qb.orderBy(`${alias}.${orderBy}`, 'DESC');
    if (Array.isArray(orderBy)) {
        const i = 0;
        for (const item of orderBy) {
            if (i === 0) {
                typeof item === 'string'
                    ? qb.orderBy(`${alias}.${item}`, 'DESC')
                    : qb.orderBy(`${alias}.${item}`, item.order);
            } else {
                typeof item === 'string'
                    ? qb.addOrderBy(`${alias}.${item}`, 'DESC')
                    : qb.addOrderBy(`${alias}.${item}`, item.order);
            }
        }
        return qb;
    }
    return qb.orderBy(
        `${alias}.${(orderBy as any).name}`,
        (orderBy as any).order,
    );
};

/**
 * 获取自定义Repository的实例
 * @param dataSource 数据连接池
 * @param Repo repository类
 */
export const getCustomRepository = <
    T extends Repository<E>,
    E extends ObjectLiteral,
>(
    dataSource: DataSource,
    Repo: ClassType<T>,
): T => {
    if (isNil(Repo)) return null;
    const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);
    if (!entity) return null;
    const base = dataSource.getRepository<ObjectType<any>>(entity);
    return new Repo(base.target, base.manager, base.queryRunner) as T;
};

/**
 * 加密明文密码
 *
 * @param {string} password
 * @returns
 * @memberof HashUtil
 */
export const encrypt = (password: string) => {
    return bcrypt.hashSync(password, userConfig().hash);
};

export const getTime = (options?: TimeOptions) => {
    if (!options) return dayjs();
    const { date, format, locale, strict, zonetime } = options;
    const config = appConfig();
    // 每次创建一个新的时间对象
    // 如果没有传入local或timezone则使用应用配置
    const now = dayjs(date, format, locale ?? config.locale, strict).clone();
    // @ts-ignore
    return now.tz(zonetime ?? config.timezone);
};

/**
 * 验证密码
 *
 * @param {string} password
 * @param {string} hashed
 * @returns
 * @memberof HashUtil
 */
export const decrypt = (plainPassword: string, password: string) => {
    return bcrypt.compareSync(plainPassword, password);
};
