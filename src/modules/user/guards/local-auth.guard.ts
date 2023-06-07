import {
    BadRequestException,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { CredentialDto } from '../dtos';

/**
 * 用户登录守卫
 */
// 这个守卫的默认作用在把请求数据赋值给LocalStrategy, 以便它使用validate对用户进行验证,
// 而我们添加一步处理, 就是在把request.body赋值给LocalStrategy之前先对它尝试序列化为CredentialDto的对象,
// 以便预检测请求的数据是否符合要求
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        try {
            // console.log(request.headers['user-agent']);
            await validateOrReject(plainToClass(CredentialDto, request.body), {
                validationError: { target: false },
            });
        } catch (errors) {
            const messages = (errors as any[])
                .map((e) => e.constraints ?? {})
                .reduce((o, n) => ({ ...o, ...n }), {});
            throw new BadRequestException(Object.values(messages));
        }
        return super.canActivate(context) as boolean;
    }
}
