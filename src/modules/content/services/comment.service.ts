import { Injectable, ForbiddenException } from "@nestjs/common";
import {
  EntityNotFoundError,
  In,
  SelectQueryBuilder
} from 'typeorm';

import { CommentRepository } from "../respositories/comment.repository";
import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from '../dto';
import { isNil } from 'lodash';
import { CommentEntity } from "../entities";
import { manualPaginate } from '@/modules/database/helpers';
import { WallRepository } from "../respositories";



@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected wallRepository: WallRepository,
    ) {

  }

  /**
     * 直接查询评论树
     * @param options
     */
  async findTrees(options: QueryCommentTreeDto = {}) {
    return this.commentRepository.findTrees({
        addQuery: (qb) => {
            return isNil(options.wall) ? qb : qb.where('wall.id = :id', { id: options.wall });
        },
    });
  }

   /**
     * 查找一篇文章的评论并分页
     * @param dto
     */
   async paginate(dto: QueryCommentDto) {
    const { wall, ...query } = dto;
    const addQuery = (qb: SelectQueryBuilder<CommentEntity>) => {
        const condition: Record<string, any> = {};
        if (!isNil(wall)) condition.wall = wall;
        return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
    };
    const data = await this.commentRepository.findRoots({
        addQuery,
    });
    let comments: CommentEntity[] = [];
    for (let i = 0; i < data.length; i++) {
        const c = data[i];
        comments.push(
            await this.commentRepository.findDescendantsTree(c, {
                addQuery,
            }),
        );
    }
    comments = await this.commentRepository.toFlatTrees(comments);
    return manualPaginate(query, comments);
    }

     /**
     * 获取评论所属 墙信息实例
     * @param id
     */
     protected async getWall(id: number) {
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
    protected async getParent(current?: number, id?: number) {
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

    /**
     * 删除评论
     * @param ids
     */
    async delete(ids: number[]) {
        const comments = await this.commentRepository.find({ where: { id: In(ids) } });
        return this.commentRepository.remove(comments);
    }
}