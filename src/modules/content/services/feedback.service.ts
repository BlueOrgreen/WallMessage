import { Injectable } from "@nestjs/common";
import { FeedBackRepository, WallRepository } from "../respositories";
import { isNil } from 'lodash';
import { CreateFeedBackDto } from '../dto';

@Injectable()
export class FeedBackService {
  constructor(
    protected feedBackRepository: FeedBackRepository,
    protected wallRepository: WallRepository,
  ) {}

       /**
     * 获取评论所属文章实例
     * @param id
     */
       protected async getPost(id: string) {
        return !isNil(id) ? this.wallRepository.findOneOrFail({ where: { id } }) : id;
    }

    
   /**
     * 新增 反馈
     * @param data
     * @param user
     */
   async create(data: CreateFeedBackDto) {
    // const parent = await this.getParent(undefined, data.parent);
    // if (!isNil(parent) && parent.post.id !== data.post) {
    //     throw new ForbiddenException('Parent comment and child comment must belong same post!');
    // }
    const item = await this.feedBackRepository.save({
        ...data,
        wall: await this.getPost(data.wall),
    });
    
    return this.feedBackRepository.findOneOrFail({ where: { id: item.id } });
  }
}