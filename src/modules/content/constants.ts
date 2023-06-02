/**
 * 类型 0 信息  1 图片
 */
export enum WallTypeEnum {
  information = 0,
  image = 1
}

export enum FeedBackType {
  like = 0,
  cancel = 1
}


/**
 * 文章排序类型
 */
export enum PostOrderType {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
  PUBLISHED = 'publishedAt',
  COMMENTCOUNT = 'commentCount',
  CUSTOM = 'custom',
}