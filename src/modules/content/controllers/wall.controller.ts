import { Body, Controller, Post } from '@nestjs/common';

import { BaseController } from '@/modules/restful/base';

import { Crud } from '@/modules/restful/decorators';

import { ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { QueryWallDto, CreateWallDto, UpdateWallDto } from '../dto/wall.dto';
import { WallEntity } from '../entities';
import { WallService } from '../services';

@Crud({
    id: 'post',
    enabled: [
        { name: 'list', option: { allowGuest: true } },
        { name: 'detail', option: { allowGuest: true } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        store: CreateWallDto,
        update: UpdateWallDto,
        list: QueryWallDto,
    },
})
@Controller('wall')
export class WallController extends BaseController<WallService> {
    constructor(protected service: WallService) {
        super(service);
    }

    @Post()
    async store(
        @Body() data: CreateWallDto,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ): Promise<WallEntity> {
        return this.service.create({ data, author });
    }
}
