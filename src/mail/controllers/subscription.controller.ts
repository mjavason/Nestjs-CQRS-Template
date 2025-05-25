import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import { CreateMailSubscriptionCommand } from 'src/mail/commands/create-mail-subscription/create-mail-subscription.command';
import { CreateMailSubscriptionDto } from 'src/mail/dtos/create-subscription.dto';
import { FilterMailSubscriptionWithPaginationDto } from 'src/mail/dtos/filter-subscription.dto';
import { SendMailParamsDTO } from 'src/mail/dtos/mail.dto';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { MailService } from 'src/mail/services/mail.service';

@Controller('mail-subscription')
@ApiTags('Mail Subscription')
@ApiOkResponse({ description: 'Success' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiBadRequestResponse({ description: 'Invalid Parameters' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class MailSubscriptionController {
  constructor(
    private readonly mailSubscriptionRepository: MailSubscriptionRepository,
    private readonly mailService: MailService,
    private readonly commandBus: CommandBus,
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
    const subscribers =
      await this.mailSubscriptionRepository.findAllNoPagination({});
    for (let i = 0; i < subscribers.length; i++) {
      await this.mailService.sendSimpleMail({
        email: subscribers[i].emailAddress,
        ...broadcast,
      });
    }

    return { message: 'Mail broadcast to all subscribers successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all subscriptions with pagination' })
  async findAll(@Query() filter: FilterMailSubscriptionWithPaginationDto) {
    return await this.mailSubscriptionRepository.findAll(filter);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a subscription by ID' })
  async findOne(@Param() uniqueIdDTO: UniqueIdDTO) {
    return await this.mailSubscriptionRepository.findOne({
      _id: uniqueIdDTO.id,
    });
  }

  //   @Patch('/:id')
  //   @ApiOperation({ summary: 'Update an existing subscription' })
  //   @Auth()
  //   async update(
  //     @Param() uniqueIdDTO: UniqueIdDTO,
  //     @Body() updateMailSubscriptionDto: UpdateMailSubscriptionDto,
  //   ) {
  //     return await this.mailSubscriptionRepository.update(uniqueIdDTO.id, updateMailSubscriptionDto);
  //   }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @Auth()
  async remove(@Param() uniqueIdDTO: UniqueIdDTO) {
    return await this.mailSubscriptionRepository.remove(uniqueIdDTO.id);
  }
}
