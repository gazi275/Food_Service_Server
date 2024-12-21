import mongoose, { Document, Schema } from "mongoose";
import { Restaurant } from "./resturant.model";

export interface IMenu {
    resturantID:mongoose.Schema.Types.ObjectId;
    name:string;
    description:string;
    price:number;
    image:string;
}
export interface IMenuDocument extends IMenu, Document {
    createdAt:Date;
    updatedAt:Date;
}

const menuSchema = new mongoose.Schema<IMenuDocument>({
  resturantID:{
  type: Schema.Types.ObjectId,
  ref:Restaurant,
  required:true
  },
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  image:{
    type:String,
    required:true
  },
},{timestamps:true});

export const Menu = mongoose.model("Menu", menuSchema);