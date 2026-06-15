import { Controller, Get, Post, Body, Param, Patch, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateDesignTaskDto } from './dto/create-product.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createDto: CreateDesignTaskDto) {
    return this.productsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post(':id/chatter')
  addComment(@Param('id') id: string, @Body() commentDto: AddCommentDto) {
    return this.productsService.addComment(id, commentDto);
  }

  // Phase 4: RBAC Status Transition Protection
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('userRole') userRole: string
  ) {
    if (status === 'HOD Reviewed' && userRole !== 'HOD') {
      throw new BadRequestException('Unauthorized Access: Only a Head of Department (HOD) can approve this status shift.');
    }
    return this.productsService.updateStatus(id, status);
  }
}