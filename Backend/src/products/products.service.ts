import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesignTask, DesignTaskDocument } from './schemas/product.schema';
import { CreateDesignTaskDto } from './dto/create-product.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(DesignTask.name) private designModel: Model<DesignTaskDocument>
  ) {}

  async create(createDto: CreateDesignTaskDto): Promise<DesignTask> {
    const createdTask = new this.designModel(createDto);
    return createdTask.save();
  }

  async findAll(): Promise<DesignTask[]> {
    return this.designModel.find().exec();
  }

  async addComment(id: string, commentDto: AddCommentDto): Promise<DesignTask> {
    const updatedTask = await this.designModel.findByIdAndUpdate(
      id,
      { $push: { chatter: commentDto } },
      { new: true }
    ).exec();

    if (!updatedTask) {
      throw new NotFoundException(`Design task with ID ${id} not found`);
    }
    return updatedTask;
  }

  // Correctly placed status tracking method
  async updateStatus(id: string, status: string): Promise<DesignTask> {
    const updatedTask = await this.designModel.findByIdAndUpdate(
      id,
      { $set: { workflowStatus: status } },
      { new: true }
    ).exec();

    if (!updatedTask) {
      throw new NotFoundException(`Design task with ID ${id} not found`);
    }
    return updatedTask;
  }
}