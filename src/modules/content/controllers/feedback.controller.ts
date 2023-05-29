import { Controller, Body, Post, SerializeOptions } from "@nestjs/common";
import { CreateFeedBackDto } from "../dto";
import { FeedBackService } from "../services/feedback.service";


@Controller('feedback')
export class FeedbackController {
  constructor(protected feedbackService: FeedBackService) {}

  // @Get()
  // @SerializeOptions({ groups: ['wall-list'] })
  // async list(
  //   @Query() options: QueryWallDto
  // ) {
  //   return this.feedbackService.paginate(options)
  // }

  @Post()
    @SerializeOptions({ groups: ['feedback-detail'] })
    async store(
        @Body()
        data: CreateFeedBackDto,
    ) {
      console.log('store feedback===>', data);
      return this.feedbackService.create(data);
    }

    // @Get(':id')
    // @SerializeOptions({ groups: ['wall-detail'] })
    // async detail(
    //   @Param('id', new ParseIntPipe())
    //   id: number,
    // ) {
    //   return this.feedbackService.detail(id);
    // }
}