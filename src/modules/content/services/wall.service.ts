import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, EntityNotFoundError } from 'typeorm';
import { paginate } from '@/modules/database/helpers';
import { WallRepository } from '../respositories';
import { WallEntity } from '../entities';
import { QueryHook } from '@/modules/database/types';
import { CreateWallDto, QueryWallDto } from '../dto/wall.dto';
import { isFunction, isNil } from 'lodash';


// 文章查询接口
type FindParams = {
  [key in keyof Omit<QueryWallDto, 'limit' | 'page'>]: QueryWallDto[key];
};

@Injectable()
export class WallService {
  constructor(
    protected wallRepository: WallRepository
  ) {}

  /**
     * 获取分页数据
     * @param options 分页选项
     * @param callback 添加额外的查询
     */
  async paginate(options: QueryWallDto, callback?: QueryHook<WallEntity>) {
    const qb = await this.buildListQuery(this.wallRepository.buildBaseQB(), options, callback);
    
    return paginate(qb, options);
  }

    /**
     * 构建文章列表查询器
     * @param qb 初始查询构造器
     * @param options 排查分页选项后的查询选项
     * @param callback 添加额外的查询
     */
  protected async buildListQuery(
    qb: SelectQueryBuilder<WallEntity>,
    options: FindParams,
    callback?: QueryHook<WallEntity>,
  ) {
    // const { feedback } = options;
    // if (typeof isPublished === 'boolean') {
    //     isPublished
    //         ? qb.where({
    //               publishedAt: Not(IsNull()),
    //           })
    //         : qb.where({
    //               publishedAt: IsNull(),
    //           });
    // }

    // this.queryOrderBy(qb, orderBy);
    // if (category) {
    //     await this.queryByCategory(category, qb);
    // }
    if (callback) return callback(qb);
    return qb;
  }

  /**
     * 创建文章
     * @param data
     */
    async create(data: CreateWallDto) {
      const createWallDto = {
        ...data,
      }
      const item = await this.wallRepository.save(createWallDto)
      return this.detail(item.id);
    }

     /**
     * 查询单篇文章
     * @param id
     * @param callback 添加额外的查询
     */
     async detail(id: number, callback?: QueryHook<WallEntity>) {
      let qb = this.wallRepository.buildBaseQB();
      qb.where(`wall.id = :id`, { id });
      qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
      const item = await qb.getOne();
      if (!item) throw new EntityNotFoundError(WallEntity, `The post ${id} not exists!`);
      console.log('detail item', item);
      return item;
  }
}