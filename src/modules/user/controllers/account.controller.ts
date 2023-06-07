import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    SerializeOptions,
    Request,
    UseGuards,
} from '@nestjs/common';

import { Guest, ReqUser } from '../decorators';

import { CredentialDto, UpdateAccountDto } from '../dtos';
import { UserEntity } from '../entities';
import { LocalAuthGuard } from '../guards';
import { AuthService, UserService } from '../services';

/**
 * 账户中心控制器
 */
// 用于用户账户的的操作
// - init: 初始化管理员账户
// - login: 登录账户
// - logout: 登出账户
// - profile: 读取个人信息
// - update: 更新个人信息
@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
    ) {}

    @Guest()
    @Post('init')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async init(): Promise<UserEntity> {
        return this.userService.init();
    }

    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() _data: CredentialDto,
    ) {
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 注销登录
     * @param req
     */
    @Post('logout')
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }

    /**
     * 获取用户个人信息
     * @param user
     */
    @Get('profile')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(@ReqUser() user: ClassToPlain<UserEntity>) {
        return this.userService.detail(user.id);
    }

    /**
     * 更新账户信息
     * @param user
     * @param data
     */
    @Patch()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async update(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body()
        data: UpdateAccountDto,
    ) {
        return this.userService.update({ id: user.id, ...data });
    }
}
