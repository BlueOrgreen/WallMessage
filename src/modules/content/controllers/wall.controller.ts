import { Controller } from "@nestjs/common";
import { WallService } from "../services";
import { BaseControllerWithTrash } from '@/modules/restful/base';
import { QueryWallDto, CreateWallDto, UpdateWallDto } from "../dto/wall.dto";
import { Crud } from '@/modules/restful/decorators';


@Crud({
  id: 'post',
  enabled: ['list', 'detail', 'store', 'update', 'delete', 'restore'],
  dtos: {
      store: CreateWallDto,
      update: UpdateWallDto,
      list: QueryWallDto,
  },
})
@Controller('wall')
export class WallController extends BaseControllerWithTrash<WallService> {
  constructor(protected service: WallService) {
    super(service);
  }
}