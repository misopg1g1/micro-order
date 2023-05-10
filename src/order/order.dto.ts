import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ItemDto } from './item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly visit_id: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  delivery_date: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  grand_total?: number = 0;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  discount?: number = 0;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
