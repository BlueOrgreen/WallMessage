import { Controller, Body, Post, SerializeOptions } from "@nestjs/common";
import { CreateFeedBackDto } from "../dto";
import { FeedBackService } from "../services/feedback.service";


@Controller('feedback')
export class FeedbackController {
  constructor(protected feedbackService: FeedBackService) {}

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