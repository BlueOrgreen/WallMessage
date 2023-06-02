import { Injectable, ForbiddenException } from "@nestjs/common";
import {
  EntityNotFoundError,
  SelectQueryBuilder
} from 'typeorm';

import { CommentRepository } from "../respositories/comment.repository";
import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from '../dto';
import { isNil } from 'lodash';
import { CommentEntity } from "../entities";
// import { manualPaginate } from '@/modules/database/helpers';
import { WallRepository } from "../respositories";
import { BaseService } from "@/modules/database/base";


// CommentService没有更新功能，并且不需要开启enableTrash
@Injectable()
export class CommentService extends BaseService<CommentEntity, CommentRepository>  {
    constructor(protected commentRepository: CommentRepository, protected wallRepository: WallRepository) {
        super(commentRepository);
    }

    /**
     * 直接查询评论树
     * @param options
     */
    async findTrees(options: QueryCommentTreeDto = {}) {
        return this.repository.findTrees({
            addQuery: async (qb) => {
                return isNil(options.wall) ? qb : qb.where('wall.id = :id', { id: options.wall });
            },
        });
    }

      /**
     * 查找一篇文章的评论并分页
     * @param dto
     */
      async paginate(options: QueryCommentDto) {
        const { wall } = options;
        const addQuery = async (qb: SelectQueryBuilder<CommentEntity>) => {
            const condition: Record<string, any> = {};
            if (!isNil(wall)) condition.wall = wall;
            return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
        };
        return super.paginate({
            ...options,
            addQuery,
        });
    }

     /**
     * 获取评论所属 墙信息实例
     * @param id
     */
     protected async getWall(id: string) {
        return !isNil(id) ? this.wallRepository.findOneOrFail({ where: { id } }) : id;
    }

    /**
     * 新增评论
     * @param data
     * @param user
     */
    async create(data: CreateCommentDto) {
        const parent = await this.getParent(undefined, data.parent);
        if (!isNil(parent) && parent.wall.id !== data.wall) {
            throw new ForbiddenException('Parent comment and child comment must belong same post!');
        }
        const item = await this.commentRepository.save({
            ...data,
            parent,
            wall: await this.getWall(data.wall),
        });
        return this.commentRepository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * 获取请求传入的父分类
     * @param current 当前分类的ID
     * @param id
     */
    protected async getParent(current?: string, id?: string) {
        if (current === id) return undefined;
        let parent: CommentEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.commentRepository.findOne({
                relations: ['parent', 'post'],
                where: { id },
            });
            if (!parent) {
                throw new EntityNotFoundError(CommentEntity, `Parent comment ${id} not exists!`);
            }
        }
        return parent;
    }
}