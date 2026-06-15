import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateDesignTaskDto {
  @IsNotEmpty()
  @IsString()
  moduleName!: string;

  @IsNotEmpty()
  @IsIn(['Retail', 'Project'])
  category!: 'Retail' | 'Project';

  @IsNotEmpty()
  @IsString()
  workflowStatus!: string;

  @IsNotEmpty()
  @IsString()
  assignedTo!: string;
}