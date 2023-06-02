import { Injectable } from "@nestjs/common";
import { FeedBackRepository, WallRepository } from "../respositories";
import { isNil } from 'lodash';
import { CreateFeedBackDto } from '../dto';
import { BaseService } from "@/modules/database/base";
import { FeedBackEntity } from "../entities";

@Injectable()
export class FeedBackService extends BaseService<FeedBackEntity, FeedBackRepository> {
  constructor(
    protected feedBackRepository: FeedBackRepository,
    protected wallRepository: WallRepository,
  ) {
    super(feedBackRepository);
  }

       /**
     * 获取评论所属文章实例
     * @param id
     */
       protected async getWall(id: string) {
        return !isNil(id) ? this.wallRepository.findOneOrFail({ where: { id } }) : id;
    }

    
   /**
     * 新增 反馈
     * @param data
     * @param user
     */
  //  async create(data: CreateFeedBackDto) {
  //   const item = await this.feedBackRepository.save({
  //       ...data,
  //       wall: await this.getPost(data.wall),
  //   });
    
  //   return this.feedBackRepository.findOneOrFail({ where: { id: item.id } });
  // }

   /**
     * 新增 反馈
     * @param data
     * @param user
     */
   async create(data: CreateFeedBackDto) {
    // const parent = await this.getParent(undefined, data.parent);
    // if (!isNil(parent) && parent.wall.id !== data.wall) {
    //     throw new ForbiddenException('Parent comment and child comment must belong same post!');
    // }
    const item = await this.feedBackRepository.save({
        ...data,
        // parent,
        wall: await this.getWall(data.wall),
    });
    console.log("item", item);
    
    return this.feedBackRepository.findOneOrFail({ where: { id: item.id } });
  }
}