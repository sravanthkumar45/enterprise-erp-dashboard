import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  sender!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}