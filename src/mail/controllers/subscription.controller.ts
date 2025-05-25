import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UniqueIdDTO } from 'src/common/dtos/unique_id.dto';
import { BroadcastMailCommand } from 'src/mail/commands/broadcast-mail/broadcast-mail.command';
import { CreateMailSubscriptionCommand } from 'src/mail/commands/create-mail-subscription/create-mail-subscription.command';
import { CreateMailSubscriptionDto } from 'src/mail/dtos/create-subscription.dto';
import { FilterMailSubscriptionWithPaginationDto } from 'src/mail/dtos/filter-subscription.dto';
import { SendMailParamsDTO } from 'src/mail/dtos/mail.dto';
import { FindAllMailSubscriptionsQuery } from 'src/mail/queries/find-all-subscriptions/find-all-subscription.query';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { FindOneMailSubscriptionQuery } from '../queries/find-one-subscription/find-one-subscription.query';

@Controller('mail-subscription')
@ApiTags('Mail Subscription')
@ApiOkResponse({ description: 'Success' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiBadRequestResponse({ description: 'Invalid Parameters' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class MailSubscriptionController {
  constructor(
    private readonly mailSubscriptionRepository: MailSubscriptionRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @Auth()
  async create(@Body() createMailSubscriptionDto: CreateMailSubscriptionDto) {
    return await this.commandBus.execute(
      new CreateMailSubscriptionCommand(createMailSubscriptionDto),
    );
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast mail to all subscribers' })
  @Auth()
  async broadcast(@Body() broadcast: SendMailParamsDTO) {
    return await this.commandBus.execute(new BroadcastMailCommand(broadcast));
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all subscriptions with pagination' })
  async findAll(@Query() filter: FilterMailSubscriptionWithPaginationDto) {
    return await this.queryBus.execute(
      new FindAllMailSubscriptionsQuery(filter),
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a subscription by ID' })
  async findOne(@Param() uniqueIdDTO: UniqueIdDTO) {
    return await this.queryBus.execute(
      new FindOneMailSubscriptionQuery(uniqueIdDTO.id),
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @Auth()
  async remove(@Param() uniqueIdDTO: UniqueIdDTO) {
    return await this.mailSubscriptionRepository.remove(uniqueIdDTO.id);
  }
}
