import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DesignTask, DesignTaskSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DesignTask.name, schema: DesignTaskSchema }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}