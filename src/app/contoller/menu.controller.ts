/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response,Express } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mongoose, { ObjectId } from "mongoose";
import uploadImageOnCloudinary from "../utils/imageUploads";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/resturant.model";

export const addMenu = async (req: Request, res: Response) => {
    try {
      const { name, description, price, resturantID } = req.body;
      const file = req.file;
  
      // Validate required fields
      if (!name || !description || !price || !resturantID) {
        return res.status(400).json({
          success: false,
          message: "All fields (name, description, price, resturantID) are required.",
        });
      }
  
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Image is required.",
        });
      }
  
      // Check if the restaurant exists and belongs to the logged-in user
      const restaurant = await Restaurant.findOne({ _id: resturantID, user: req.id });
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found or unauthorized access.",
        });
      }
  
      // Upload image to Cloudinary
      const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
  
      // Create menu item
      const menu = await Menu.create({
        name,
        description,
        price,
        image: imageUrl,
        resturant_Id: restaurant._id, 
      });
  
   
      restaurant.menus.push(menu._id);
      await restaurant.save();
  
      return res.status(201).json({
        success: true,
        message: "Menu added successfully.",
        menu,
      });
    } catch (error) {
      console.error("Error adding menu:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  export const editMenu = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const file = req.file;
  
      // Find the menu by ID
      const menu = await Menu.findById(id);
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found.",
        });
      }
  
      // Update menu fields if provided
      if (name) menu.name = name;
      if (description) menu.description = description;
      if (price) menu.price = price;
  
      // Update image if provided
      if (file) {
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        menu.image = imageUrl;
      }
  
      await menu.save();
  
      return res.status(200).json({
        success: true,
        message: "Menu updated successfully.",
        menu,
      });
    } catch (error) {
      console.error("Error updating menu:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };