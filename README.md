# 留言墙 项目后端

## Nest 核心概念

### controller 控制器

定义路由路径来指定控制器 `@Controller('路由路径')`


### 提供者 
在nestjs中如果要使一个类变成提供者，需要在其顶部添加 `@Injectale()` 装饰器
同时，提供者需要在模块元素的 `provider` 中注册. 才可以被本模块中的其他类所注入；需要在exports中导出后才能被其它模块调用

```tsx
@Injectable()
export class PostService {}

@Module({
    // ...
    providers: [PostService],
    exports: [PostService],
})
export class ForumModule {}
```

### 模块

可以理解为 功能的集合 包含了控制器，服务

### DTO与数据验证

使用 验证库 `class-validator` 
body和query数据的验证一般使用全局管道 `ValidationPipe` +  `dto`
对于param数据的验证一般直接使用预定义或者自定义的非全局管道, `ParseUUIDPipe`