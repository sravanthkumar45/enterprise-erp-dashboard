import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DesignTaskDocument = DesignTask & Document;

@Schema({ timestamps: true })
export class ChatterMessage {
  @Prop({ required: true })
  sender!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

const ChatterMessageSchema = SchemaFactory.createForClass(ChatterMessage);

@Schema({ timestamps: true })
export class DesignTask {
  @Prop({ required: true })
  moduleName!: string;

  @Prop({ required: true, enum: ['Retail', 'Project'] })
  category!: string;

  @Prop({ 
    required: true, 
    enum: ['Design Task New', 'Design Planned', 'In Progress', 'Design Completed', 'HOD Reviewed', 'Sales Review', 'Rework/Error'],
    default: 'Design Task New'
  })
  workflowStatus!: string;

  @Prop({ required: true })
  assignedTo!: string;

  // Scoped Chatter messaging array embedded directly inside the task
  @Prop({ type: [ChatterMessageSchema], default: [] })
  chatter!: ChatterMessage[];
}

export const DesignTaskSchema = SchemaFactory.createForClass(DesignTask);