import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignTaskDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateDesignTaskDto) {}