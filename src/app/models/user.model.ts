import mongoose, { Document, Model } from "mongoose";

export interface IUser {
    fullname:string;
    email:string;
    password:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    role:'admin'| 'owner'| 'user',
    lastLogin?: Date;
    isVerified?: boolean;
    resetPasswordToken?:string;
    resetPasswordTokenExpiresAt?:Date;
    verificationToken?:string;
    verificationTokenExpiresAt?:Date
}

export interface IUserDocument extends IUser, Document {
    createdAt:Date;
    updatedAt:Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: "Update your address"
    },
    city:{
        type:String,
        default:"Update your city"
    },
    country:{
        type:String,
        default:"Update your country"
    },
    profilePicture:{
        type:String,
        default:"",
    },
  role:{
    type:String,
    enum:['admin','owner','user'],
    default:'user'
  },
    // advanced authentication
    lastLogin:{
        type:Date,
        default:Date.now
    },
    
    resetPasswordToken:String,
    resetPasswordTokenExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},{timestamps:true});

export const User : Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);