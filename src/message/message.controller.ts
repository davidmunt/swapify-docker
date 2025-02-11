import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SendMessageDto } from './message.dto';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message and notification to a user' })
  @ApiResponse({ status: 201, description: 'Message sent and notification delivered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Product or user not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async sendMessageForNotification(@Body() sendMessageDto: SendMessageDto) {
    return await this.messageService.sendMessageForNotification(
      sendMessageDto.productId, 
      sendMessageDto.text, 
      sendMessageDto.sender, 
      sendMessageDto.reciver
    );
  }
}
