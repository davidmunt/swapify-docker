import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SendMessageDto } from './message.dto';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar un mensaje y notificación a un usuario' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado y notificación enviada correctamente' })
  async sendMessageForNotification(@Body() sendMessageDto: SendMessageDto) {
    return await this.messageService.sendMessageForNotification(
      sendMessageDto.productId, 
      sendMessageDto.text, 
      sendMessageDto.sender, 
      sendMessageDto.reciver
    );
  }
}
