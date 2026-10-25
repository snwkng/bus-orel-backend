import { PartialType } from '@nestjs/swagger';
import { CreateBusTourDto } from './create-bus-tour-dto';

export class UpdateBusTourDto extends PartialType(CreateBusTourDto) {}
