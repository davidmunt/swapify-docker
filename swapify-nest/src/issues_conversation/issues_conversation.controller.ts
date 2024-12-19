import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Body,
  Post,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { IssueConversationService } from './issues_conversation.service';

@Controller('issue_conversation')
export class IssueConversationController {
  constructor(
    private readonly issueConversationService: IssueConversationService,
  ) {}

  @Get()
  async getAllIssueConversation(@Query('xml') xml: string) {
    const conversations =
      await this.issueConversationService.getAllIssueConversation(xml);
    return conversations;
  }

  @Get(':id')
  async getIssueConversation(
    @Param('id') id: string,
    @Query('xml') xml: string,
  ) {
    const issueConversationId = parseInt(id);
    if (isNaN(issueConversationId)) {
      throw new HttpException('Invalid issue ID', HttpStatus.BAD_REQUEST);
    }

    const conversations =
      await this.issueConversationService.getIssueConversation(
        issueConversationId,
        xml,
      );

    return conversations;
  }

  @Post()
  createIssueConversation(@Body() body: any) {
    return this.issueConversationService.createIssueConversation(body);
  }

  @Delete(':id')
  deleteIssueConversation(@Param('id') id_conversation: string) {
    const conversationId = parseInt(id_conversation);
    if (isNaN(conversationId)) {
      throw new HttpException(
        'Invalid conversation ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.issueConversationService.deleteIssueConversation(
      conversationId,
    );
  }

  @Put(':id')
  updateIssueConversation(
    @Param('id') id_conversation: string,
    @Body('notes') notes: string,
  ) {
    const conversationId = parseInt(id_conversation);
    if (isNaN(conversationId)) {
      throw new HttpException(
        'Invalid conversation ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!notes) {
      throw new HttpException('Notes cannot be empty', HttpStatus.BAD_REQUEST);
    }

    return this.issueConversationService.updateIssueConversation(
      conversationId,
      notes,
    );
  }
}
