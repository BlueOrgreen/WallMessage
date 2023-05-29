import { Controller, Get, Query, Body, Post, SerializeOptions, Param, ParseIntPipe } from "@nestjs/common";
import { WallService } from "../services";
import { QueryWallDto, CreateWallDto } from "../dto/wall.dto";


@Controller('wall')
export class WallController {
  constructor(protected wallService: WallService) {}

  @Get()
  @SerializeOptions({ groups: ['wall-list'] })
  async list(
    @Query() options: QueryWallDto
  ) {
    return this.wallService.paginate(options)
  }

  @Post()
    @SerializeOptions({ groups: ['wall-detail'] })
    async store(
        @Body()
        data: CreateWallDto,
    ) {
      console.log('store===>', data);
      return this.wallService.create(data);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['wall-detail'] })
    async detail(
      @Param('id', new ParseIntPipe())
      id: number,
    ) {
      return this.wallService.detail(id);
    }
}