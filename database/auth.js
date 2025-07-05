import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BlacklistedToken from "./blacklistModel.js"
import { Wishlist } from "./wishlist_service.js";

dotenv.config();
 
const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true }, 
    role: { type: String, enum: ['user', 'admin', 'vendor'], default: 'user' },
    Avatar: { type: String, default: "default.png" },
    PhoneNumber: { type: String, default: "Not provided" },
    addresses: {
    type: [
        new mongoose.Schema(
            {
                type: { type: String, enum: ['Home', 'Work', 'Other'], required: false },
                street: { type: String, default: "Not provided" },
                city: { type: String, default: "Not provided" },
                state: { type: String, default: "Not provided" },
                zipCode: { type: String, default: "000000" },
                isDefault: { type: Boolean, default: false }
            },
            { _id: true } 
            )
        ],
        default: []
    }
});

const User = mongoose.model("User", userSchema);


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Users_info";

async function ensureDBConnection() {
    if (mongoose.connection.readyState !== 1) { // 1 = Connected
        console.log("🔄 Reconnecting to MongoDB...");
        await mongoose.connect(MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }).catch(err => {
            console.error("MongoDB reconnection failed:", err);
        });
    }
}

export class AuthService {
    
    async createAccount({Name, Email, Password, Avatar }) {
        await ensureDBConnection(); 
            
        try { 

            if (!Name || !Email || !Password) {
                throw new Error("Missing required fields: Email, Password, or Name");
            }

            let existingUser = await User.findOne({ Email });
            if (existingUser){
                console.log("User already exists");
                throw new Error("User already exists");
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Password, saltRounds);

            console.log("Creating user:", { Name, Email, Password: hashedPassword, Avatar });
            const newUser = new User({ Name, Email, Password: hashedPassword, Avatar });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user: newUser };
            
        } catch (error) {
            throw error;
        }
    }

    async login({ Email, Password }) {
        
        await ensureDBConnection(); 
            
        try {
            const user = await User.findOne({ Email });
            if (!user) throw new Error("Invalid Credentials");

            const isMatch = await bcrypt.compare(Password, user.Password);
            if (!isMatch) throw new Error("Invalid Credentials");

            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );
              
            return { token, user: { id: user._id, Name: user.Name, Email: user.Email, role: user.role } };
            
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(id) {
        try {
            if (!id) return null;
            const user = await User.findById(id).select("-Password");
            return user;

        } catch (error) {
            return null;
        }
    }

    async logout(token) {
        try {
            if (!token) throw new Error("Token is required for logout");
    
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) throw new Error("Invalid token");
    
            const expiresAt = new Date(decoded.exp * 1000); 
            await BlacklistedToken.create({ token, expiresAt });
    
            return { message: "User logged out successfully" };
        } catch (error) {
            throw error; 
        }
    }

    async avatar(userId, avatarFileName) {    
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { Avatar: avatarFileName },
                { new: true } 
            );
            return updatedUser;
        } catch (error) {
            throw new Error("Failed to update avatar");
        }
    }

    async getAvatar(userId) {
        try {
            const user = await User.findById(userId).select("Avatar");
            console.log(user);
            
            if (!user) throw new Error("User not found");
            return user.Avatar;
        } catch (error) {
            throw new Error("Failed to fetch avatar");
        }
    }

    async updateProfile(userId, updatedData) {
        try {
            const allowedUpdates = {
                PhoneNumber: updatedData.phone,
                Avatar: updatedData.avatar || "default.png",
                addresses: updatedData.addresses || []
            };

            if (Array.isArray(allowedUpdates.addresses)) {
                console.log("Address provided, processing...");
                
                let defaultFound = false;
                allowedUpdates.addresses = allowedUpdates.addresses.map(address => {
                    const isDefault = address.isDefault === true && !defaultFound;
                    if (isDefault) defaultFound = true;

                    return { 
                    type: address.type || 'Home',
                    street: address.street || 'Not provided',
                    city: address.city || 'Not provided',
                    state: address.state || 'Not provided',
                    zipCode: address.zipCode || '000000',
                    isDefault,
                    };
                });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: allowedUpdates },
                { new: true, runValidators: true }
            );
        
            if (!updatedUser) throw new Error("User not found");
        
            console.log("Received update request data:", updatedData);
            return updatedUser;

        } catch (error) {
          throw new Error("Failed to update profile: " + error.message);
        }
      }

    async getProfile(userId) {
        try {
          const user = await User.findById(userId).select("Name Email Avatar PhoneNumber addresses");
          if (!user) throw new Error("User not found");
          return user;
        } catch (error) {
          throw new Error("Failed to fetch user profile");
        }
      }

    async getAddressAndNumber(userId) {
        try {
          const user = await User.findById(userId).select("PhoneNumber addresses");
          if (!user) throw new Error("Not found");
          return user;
        } catch (error) {
          throw new Error("Failed to fetch");
        }
      }

    async addCheckoutAddress(userId, phone, address) {
        try {
            const formattedAddress = {
            type: address.type || "Home",
            street: address.street || "Not provided",
            city: address.city || "Not provided",
            state: address.state || "Not provided",
            zipCode: address.zipCode || "000000",
            isDefault: false 
            };

            const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { PhoneNumber: phone },
                $push: { addresses: formattedAddress }
            },
            { new: true, runValidators: true }
            );

            if (!updatedUser) throw new Error("User not found");
            return updatedUser;
        } catch (error) {
            throw new Error("Failed to update address: " + error.message);
        }
    }

    async deleteAddress(userId, addressId) {
        try {
            console.log("Attempting to pull address with ID:", addressId);

            const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    addresses: { _id: new mongoose.Types.ObjectId(addressId) } 
                }
            },
            { new: true }
            );

            if (!updatedUser) throw new Error("User not found");
            return updatedUser;
        } catch (error) {
            throw new Error("Failed to delete address: " + error.message);
        }
    }
    
    async addToWishlist(userId, productId, selectedColor, selectedSize) {
        try {
            const existing = await Wishlist.findOne({ user: userId, product: productId, selectedColor, selectedSize });
            if (existing) throw new Error("Product already in wishlist");

            const wishlistItem = new Wishlist({
            user: userId,
            product: productId,
            selectedColor,
            selectedSize
            });

            await wishlistItem.save();
            return wishlistItem;
        } catch (error) {
            throw new Error(error.message || "Failed to add to wishlist");
        }
    }

    async removeFromWishlist(userId, productId, selectedColor, selectedSize) {
        try {
            const deletedItem = await Wishlist.findOneAndDelete({
            user: userId,
            product: productId,
            selectedColor,
            selectedSize
            });

            if (!deletedItem) throw new Error("Item not found in wishlist");

            return deletedItem;
        } catch (error) {
            throw new Error("Failed to remove from wishlist");
        }
    }
    
    async getWishlist(userId) {
        try {
            const wishlist = await Wishlist.find({ user: userId }).populate({
            path: 'product',
            select: 'Product_ID Name Images Discount Variants Comic_Theme T_Shirt_Type',
            });

            return wishlist;
        } catch (error) {
            throw new Error("Failed to fetch wishlist");
        }
    }
    
}

export const authService = new AuthService();
export { User };