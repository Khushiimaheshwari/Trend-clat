import mongoose from "mongoose";
import { User } from "./auth.js";

const productSchema = new mongoose.Schema({
    Name: { type: String, required: [true, 'Product name is required'], trim: true, },
    Description: { type: String, required: [true, 'Product description is required'], },
    T_Shirt_Type: { type: String, required: true, },
    Comic_Theme: { type: String, required: true, },
    Variants: [
        { 
            Size: { type: [String], required: true },
            Color: { type: String },
            Stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] },
            Price: { type: Number, required: true, min: [0, 'Amount must be positive'], },
        }
    ],
    Discount: { type: Number, default: 0, },
    Images: [
      {
        Url: { type: String, required: true },
        Alt: { type: String },
      },
    ],
    Status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', },
    ReviewFeedback: { type: String, default: '',  },
    ReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin',  },
    ReviewedAt: { type: Date, },
    Product_Rating: {
      Average: { type: Number, default: 0, },
      Count: { type: Number, default: 0,},
    },
    Product_Reviews: [
      {
        User: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        Rating: { type: Number, required: true },
        Comment: { type: String },
        CreatedAt: { type: Date, default: Date.now },
      },
    ],
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    Delivery: [
        {
            Days_Required: { type: Number, required: true },
            Locations: { type: [String], required: true },
            Condition: { type: String, enum: ['Free delivery', '$price delivery charge'], default: 'Free delivery', },
            ConditionValue: { type: Number, default: null, },
        }
    ],
    ReturnPolicy: [
        {
            Available: { type: Boolean, required: true },
            ValidTill: { type: String, enum:['$day easy returns', 'No returns available'], default: 'No returns available' },
            returnDays: { type: Number,  default: 0, },
        }
    ]
  },
  {
    timestamps: true,
  }
);

function generateUniqueId() {
  const now = new Date();
  const prefix = "PID"
  const timestamp = now.getTime(); 
  const randomNum = Math.floor(Math.random() * 1000); 
  return `${prefix}-${timestamp}-${randomNum}`;
}

const Product = mongoose.model('Product', productSchema);

export class Product_Service {

  async addProduct({ Name, Description, T_Shirt_Type, Comic_Theme, Variants, Discount = 0, Images, CreatedBy, Delivery, ReturnPolicy}) {
    try {

      if (!Name || !Description || !T_Shirt_Type || !Comic_Theme || !Variants?.length || !Images?.length || !CreatedBy) {
        throw new Error("Missing required fields");
      }

      const Product_ID = generateUniqueId();

      console.log("Creating Product");
      const newProduct = new Product({
        Product_ID,
        Name,
        Description,
        T_Shirt_Type,
        Comic_Theme,
        Variants,
        Discount,
        Images,
        CreatedBy,
        Delivery,
        ReturnPolicy,
      });

      const savedProduct = await newProduct.save();
      return savedProduct;

    } catch (error) {
      console.error("Error adding product:", error.message);
      throw error;
    }
  }

  async getProduct(Product_ID) {
    try {
      const product = await Product.findById(Product_ID).select("Product_ID Name Description T_Shirt_Type Comic_Theme Variants Discount Images Status ReviewFeedback ReviewedBy ReviewedAt Product_Rating Product_Reviews CreatedBy Delivery ReturnPolicy");
      if (!product) throw new Error("Product not found");

      const vendor = await this.getVendorNameById(product.CreatedBy);

      return {
        ...product.toObject(),
        Vendor: vendor,
      };
      
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  } 

  async getAllProducts({ page = 1, limit = 10, search = '', category, type }) {
    try {
      const query = {};
      
      if (search) {
        query.Name = { $regex: search, $options: 'i' }; 
      }
      if (category) {
        query.Comic_Theme = category;
      }
      if (type) {
        query.T_Shirt_Type = type; 
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalCount = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      const products = await Product.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("Product_ID Name Description T_Shirt_Type Comic_Theme Variants Discount Images Status CreatedBy Delivery ReturnPolicy createdAt ");

        const productsWithVendor = await Promise.all(
          products.map(async (product) => {
            const vendor = await this.getVendorNameById(product.CreatedBy);
            return {
              ...product.toObject(),
              Vendor: vendor, 
            };
          })
        );

      return { products: productsWithVendor, totalPages };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch products");
    }
  }

  async getVendorNameById(vendorId) {
    try {
      const vendor = await User.findById(vendorId).select("Name Email role");
      console.log(vendor);
      
      if (!vendor) {
        return { Name: "Unknown Vendor", Email: "", role: "vendor" };
      }

      return vendor;
    } catch (error) {
      console.error("Error fetching vendor:", error.message);
      return { Name: "Unknown Vendor", Email: "", role: "vendor" };
    }
  }

  async editProduct(productId, updates) {
    try {
      const updated = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
      });
      if (!updated) throw new Error("Product not found");
      return updated;
    } catch (error) {
      console.error("Edit Product Error:", error.message);
      throw error;
    }
  }

  async approveProduct(productId) {
    try {
      const approved = await Product.findByIdAndUpdate(
        productId,
        {
          Status: "Approved",
        },
        { new: true }
      );
      if (!approved) throw new Error("Product not found");
      return approved;
    } catch (error) {
      console.error("Approve Error:", error.message);
      throw error;
    }
  }

  async rejectProduct(productId) {
    try {
      const rejected = await Product.findByIdAndUpdate(
        productId,
        {
          Status: "Rejected",
        },
        { new: true }
      );
      if (!rejected) throw new Error("Product not found");
      return rejected;
    } catch (error) {
      console.error("Reject Error:", error.message);
      throw error;
    }
  }

  async updateProduct(productId, updates){
    try {
      const updated = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
      });
      if (!updated) throw new Error("Product not found");
      return updated;
    } catch (error) {
      console.error("Edit Product Error:", error.message);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deleted = await Product.findByIdAndDelete(productId);
      if (!deleted) throw new Error("Product not found");
      return deleted;
    } catch (error) {
      console.error("Delete Product Error:", error.message);
      throw error;
    }
  }

  async getAllProducts_vendor({ page = 1, limit = 10, search = '', category, type, CreatedBy }) {
    try {
      const query = {};
      
      if (search) {
        query.Name = { $regex: search, $options: 'i' }; 
      }
      if (category) {
        query.Comic_Theme = category;
      }
      if (type) {
        query.T_Shirt_Type = type; 
      }
      if (CreatedBy) {
        query.CreatedBy = CreatedBy; 
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalCount = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      const products = await Product.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("Name Description T_Shirt_Type Comic_Theme Variants Discount Status Images CreatedBy Delivery");

      return { products, totalPages };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }

  async displayProducts_User({ page = 1, limit = 10, search = '', category, type, status }) {
    try {
      const query = {};
      
      if (search) {
        query.Name = { $regex: search, $options: 'i' }; 
      }
      if (category) {
        query.Comic_Theme = category;
      }
      if (type) {
        query.T_Shirt_Type = type; 
      }

      if (status) {
        query.Status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalCount = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      const products = await Product.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select("Product_ID Name Variants T_Shirt_Type Comic_Theme Images Discount Status CreatedBy createdAt");

        const productsWithVendor = await Promise.all(
          products.map(async (product) => {
            const vendor = await this.getVendorNameById(product.CreatedBy);
            return {
              ...product.toObject(),
              Vendor: vendor, 
            };
          })
        );

      return { products: productsWithVendor, totalPages };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch products");
    }
  }

}

export const prod_service = new Product_Service();
export { Product };