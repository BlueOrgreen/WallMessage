import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/restful/base';

import { Crud } from '@/modules/restful/decorators';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../dtos';

import { UserService } from '../services/user.service';

/**
 * 用户管理控制器
 */
// 用于用户管理的操作，继承自BaseController
@Crud({
    id: 'user',
    enabled: [
        'list',
        { name: 'detail', option: { allowGuest: true } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: QueryUserDto,
        create: CreateUserDto,
        update: UpdateUserDto,
    },
})
@Controller('users')
export class UserController extends BaseController<UserService> {
    constructor(protected userService: UserService) {
        super(userService);
    }
}
