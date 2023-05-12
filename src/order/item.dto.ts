import { ApiProperty } from '@nestjs/swagger';

import {IsNotEmpty, IsNumber, IsUUID} from 'class-validator';

export class ItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
