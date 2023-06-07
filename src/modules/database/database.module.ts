import {
    DynamicModule,
    Module,
    ModuleMetadata,
    Provider,
    Type,
} from '@nestjs/common';
import {
    getDataSourceToken,
    TypeOrmModule,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

// import { UniqueConstraint, UniqueExistContraint, UniqueTreeConstraint, UniqueTreeExistConstraint } from './constraints';
import { CUSTOM_REPOSITORY_METADATA } from './constants';
import { DataExistConstraint } from './constraints';
// import { DataExistConstraint } from './constraints';

@Module({})
export class DatabaseModule {
    static forRoot(configRegister: () => TypeOrmModuleOptions): DynamicModule {
        const providers: ModuleMetadata['providers'] = [
            DataExistConstraint,
            // DataExistConstraint,
            // UniqueConstraint,
            // UniqueExistContraint,
            // UniqueTreeConstraint,
            // UniqueTreeExistConstraint,
        ];
        return {
            global: true,
            module: DatabaseModule,
            imports: [TypeOrmModule.forRoot(configRegister())],
            providers,
        };
    }

    /**
     * 注册自定义Repository
     * 在DatabaseModule中编写一个静态方法，用于把自定义的Repository类注册为提供者
     * @param repositories 需要注册的自定义类列表
     * @param dataSourceName 数据池名称,默认为默认连接
     */
    static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];

        // 遍历每个自定义的Repository类判断是否有通过CUSTOM_REPOSITORY_METADATA常量存储的模型，
        // 如果没有则忽略，因为这个类不是自定义Repository
        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(
                CUSTOM_REPOSITORY_METADATA,
                Repo,
            );

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (
                    dataSource: DataSource,
                ): InstanceType<typeof Repo> => {
                    // 首先我们获取数据库连接实例
                    const base =
                        dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(
                        base.target,
                        base.manager,
                        base.queryRunner,
                    );
                },
            });
        }

        return {
            exports: providers,
            module: DatabaseModule,
            providers,
        };
    }
}
