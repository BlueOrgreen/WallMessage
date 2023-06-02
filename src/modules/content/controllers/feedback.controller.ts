import { Controller, Body, Post, SerializeOptions } from "@nestjs/common";
import { CreateFeedBackDto, QueryFeedBackDto } from "../dto";
import { FeedBackService } from "../services/feedback.service";
import { Crud } from '@/modules/restful/decorators';
import { BaseController } from '@/modules/restful/base';

@Crud({
  id: 'post',
  enabled: ['list', 'detail', 'store', 'delete'],
  dtos: {
      store: CreateFeedBackDto,
      list: QueryFeedBackDto,
  },
})
@Controller('feedback')
export class FeedbackController extends BaseController<FeedBackService> {
  constructor(protected feedbackService: FeedBackService) {
    super(feedbackService);
  }

  @Post()
    @SerializeOptions({ groups: ['feedback-detail'] })
    async store(
        @Body()
        data: CreateFeedBackDto,
    ) {
      console.log('store feedback===>', data);
      return this.feedbackService.create(data);
    }
}