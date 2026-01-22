import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Room {
  @ApiProperty({
    example: "room name",
    description: 'room name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: "room type",
    description: 'room type',
  })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({
    example: "capacity",
    description: 'capacity',
  })
  @Prop({ type: Number, required: true })
  capacity: number;

  @ApiProperty({
    example: "in room",
    description: 'in room',
  })
  @Prop({ type: String })
  inRoom: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);