import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authService }  from "../database/auth.js";
import { prod_service }  from "../database/product_service.js";
import { cartService } from "../database/cart_service.js";
import order_service from "../database/order_service.js";
import { stripeService } from "../database/stripe_service.js";
import { generateOrderId } from "../database/order_service.js";
import { PendingOrder } from "../database/order_service.js";
import authenticateuserData from "../database/authmiddleware.js";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import passport from "passport"
import './passport.js';
import multer from "multer"
import path  from "path"
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5000;
const app = express();

app.use('/webhook', express.raw({ type: 'application/json' }));

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/Product_Images', express.static(path.join(__dirname, '../public/Product_Images')));

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI){
    console.error("MONGO_URI is missing from .env file");
    process.exit(1);
} 

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully - from connectDB");

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

connectDB()
.then(() => {
  app.use(cookieSession({ secret: "secret", resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));})
.catch(err => console.error("Failed to start server:", err));


/* AUTHENTICATION */
  
  // SignUp 
  app.post("/signup", async (req, res) => {
    try {
        console.log(" Received signup request with body:", req.body); 

        const { Name, Email, Password } = req.body;

        if (!req.body || !Name || !Email || !Password) {
        console.log(" Invalid request body:", req.body);
        return res.status(400).json({ error: "Missing required fields: Email, Password, or Name" });
        }

        const { token, user } = await authService.createAccount(req.body);

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: '/',
          maxAge: 3600000, 
        });

        const { Name: userName, role } = user;
        res.status(201).json({ Name: userName, role });

    } catch (error) {
          res.status(400).json({ error: error.message });
    }
  });
  
  // Login 
  app.post("/login", async (req, res) => {
      try {
        console.log(" Received login request:", req.body);

        const userData = await authService.login(req.body);

        res.cookie("token", userData.token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax", 
            maxAge: 3600000, 
        });

        const { Name, role } = userData.user;
        res.json({ Name, role }); 
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  });
  
  // Get Current user
  app.get("/userData", authenticateuserData, async (req, res) => {
    
    try {
      const userData = await authService.getCurrentUser(req.userData.id);
      console.log("UserData: ", userData );
      
      res.json({ id: userData._id, Name: userData.Name, role: userData.role });
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Unauthorized" });
    }
  });
  
  // Logout 
  app.post("/logout", authenticateuserData, async (req, res) => {
    
      try {
        const token = req.token; 
        if (!token) return res.status(400).json({ error: "Token is required for logout" });

        const response = await authService.logout(token);
        console.log(response);

        res.clearCookie("token"); 
        console.log("Token Cleared...."); 
        
        res.json(response);
        
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });

  // OAuth
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  // OAuth Callback route
  app.get("/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    (req, res) => {
      const token = generateToken(req.user); 
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Lax" });
      res.redirect("http://localhost:5173/redirect"); 
    });

    function generateToken(user) {
      return jwt.sign(
        { id: user._id, Name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    }

// -------------------------------------------------------------------------------------------------------

/* PROFILE */

  // Store Avatar Image to database
  app.patch("/avatar", authenticateuserData, async (req, res) => {

    try {
      const { id } = req.userData;
      const { Avatar } = req.body;
      const updatedUser = await authService.avatar(id, Avatar);
  
      res.json({ message: "Profile updated", user: updatedUser });
      
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }); 

  // Get Avatar Image
  app.get("/getAvatar", authenticateuserData, async (req, res) => {

    try {
        const { id } = req.userData;
        const avatar = await authService.getAvatar(id);
        console.log(avatar);
        res.json({ avatar });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
  });

  // Update User Profile
  app.put('/update_user_profile', authenticateuserData, async (req, res) => {
    try {
      const { id } = req.userData;
      const updatedData = req.body;
  
      const updatedUser = await authService.updateProfile(id, updatedData);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // User Profilr
  app.get("/user_profile", authenticateuserData, async (req, res) => {
    try {
      const { id } = req.userData;
      const profile = await authService.getProfile(id);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // User Profilr
  app.get("/user_address_and_number", authenticateuserData, async (req, res) => {
    try {
      const { id } = req.userData;
      const profile = await authService.getAddressAndNumber(id);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/add_checkout_address", authenticateuserData, async (req, res) => {
  try {
    const { id } = req.userData;
    const { phone, address } = req.body;

    const updatedUser = await authService.addCheckoutAddress(id, phone, address);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete_address/:addressId", authenticateuserData, async (req, res) => {
  try {
    const { id } = req.userData; 
    const { addressId } = req.params;

    const updatedUser = await authService.deleteAddress(id, addressId);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------------------------------------------

/* PRODUCT */

  app.post("/add_product", async(req, res) => {
    try {
      const productData = req.body;
      const product = await prod_service.addProduct(productData);
      console.log(product);
      res.json({ product });
      
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/product_info/:id", async(req, res) => {
    try {
      const productId = req.params.id; 
      const product = await prod_service.getProduct(productId);
      console.log(product);
      res.json({ product });
      
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/all_products_vendor", async (req, res) => {
  try {

     const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const vendorId = decoded.id;

    const { page, limit, search, category, type } = req.query;

    const result = await prod_service.getAllProducts_vendor({
      page,
      limit,
      search,
      category,
      type,
      CreatedBy: vendorId,
    });

    console.log(result);
    res.json(result); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/update_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const updated = await prod_service.updateProduct(productId, updates);
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete("/delete_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await prod_service.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get("/all_products", async (req, res) => {
  try {

    const { page, limit, search, category, type } = req.query;

    const result = await prod_service.getAllProducts({
      page,
      limit,
      search,
      category,
      type,
    });

    console.log(result);
    res.json(result); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/edit_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const updated = await prod_service.editProduct(productId, updates);
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/approve_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const Approved = await prod_service.approveProduct(productId);
    res.json({ success: true, product: Approved });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/reject_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const Rejected = await prod_service.rejectProduct(productId);
    res.json({ success: true, product: Rejected });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get("/approved_products", async (req, res) => {
  try {
    const { page, limit, search, category, type } = req.query;

    const result = await prod_service.displayProducts_User({
      page,
      limit,
      search,
      category,
      type,
      status: "Approved", 
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching approved products:", error);
    res.status(500).json({ error: error.message });
  }
});


// Multer config

const imageDir = path.join(__dirname, '../public/Product_Images');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Image Upload for Product
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/Product_Images/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -------------------------------------------------------------------------------------------------------

/* WISHLIST */

// Add product to wishlist
app.post("/addToWishlist/:id", authenticateuserData, async (req, res) => {
  try {
    const userId = req.userData.id;
    const productId = req.params.id;
    const { selectedColor, selectedSize } = req.body;

    if (!selectedColor || !selectedSize) {
      return res.status(400).json({ error: "Color and Size are required" });
    }

    const wishlistItem = await authService.addToWishlist(userId, productId, selectedColor, selectedSize);
    res.json({ message: "Product added to wishlist", wishlistItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove product from wishlist
app.delete("/removeFromWishlist/:id", authenticateuserData, async (req, res) => {
  try {
    const { id: userId } = req.userData;
    const productId = req.params.id;
    const { selectedColor, selectedSize } = req.body;

    if (!selectedColor || !selectedSize) {
      return res.status(400).json({ error: "Color and Size required" });
    }

    const removedItem = await authService.removeFromWishlist(
      userId,
      productId,
      selectedColor,
      selectedSize
    );

    if (!removedItem) throw new Error("Wishlist item not found");

    res.json({ message: "Product removed from wishlist", removedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's wishlist
app.get("/wishlist", authenticateuserData, async (req, res) => {
  try {
    const { id } = req.userData;
    const wishlist = await authService.getWishlist(id);
    res.json({ wishlist });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// -------------------------------------------------------------------------------------------------------

/* CART */

// Add product to cart
app.post("/addToCart/:id", authenticateuserData, async (req, res) => {
  try {
      const userId = req.userData.id;
      const productId = req.params.id;
      const { vendorId, selectedSize, selectedColor, quantity, price } = req.body;

      if (!selectedSize || !selectedColor ) {
          return res.status(400).json({ error: "Size and Color required" });
      }
      if ( !price ) {
          return res.status(400).json({ error: "Price required" });
      }
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        console.error("Invalid Vendor ID:", vendorId);
        return res.status(400).json({ error: "Invalid Vendor ID" });
      }

      const cart = await cartService.addToCart(
          userId,
          productId,
          vendorId,
          selectedSize,
          selectedColor,
          quantity || 1,
          price 
      );

      res.json({ message: "Product added to cart", cart });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Remove product from cart
app.delete("/removeFromCart/:id", authenticateuserData, async (req, res) => {
  try {
      const userId = req.userData.id;
      const productId = req.params.id;
      const { selectedSize, selectedColor } = req.body;

      if (!selectedSize || !selectedColor) {
          return res.status(400).json({ error: "Size and Color required" });
      }

      const cart = await cartService.removeFromCart(
          userId,
          productId,
          selectedSize,
          selectedColor
      );

      res.json({ message: "Product removed from cart", cart });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Get user's cart
app.get("/getCart", authenticateuserData, async (req, res) => {
  try {
      const userId = req.userData.id;
      const cart = await cartService.getCart(userId);
      res.json({ cart });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Update quantity in cart
app.put("/updateQuantityInCart", authenticateuserData, async (req, res) => {
  try {
    const userId = req.userData.id;
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Valid itemId and quantity required" });
    }

    const updatedCart = await cartService.updateQuantityInCart(userId, itemId, quantity);
    res.json({ message: "Quantity updated successfully", cart: updatedCart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/updateCartTotal', authenticateuserData, async (req, res) => {
  try {
    const userId = req.userData.id;
    const { newTotal } = req.body;

    if (typeof newTotal !== 'number' || newTotal < 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    const updatedCart = await cartService.updateCartTotal(userId, newTotal);
    res.json({ message: "Cart total updated", cart: updatedCart });
  } catch (err) {
    console.error("Error updating cart total:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// -------------------------------------------------------------------------------------------------------

/* ORDER */

app.get('/user_orders', authenticateuserData, async (req, res) => {
  try {
    const customerId = req.userData.id;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID missing from token" });
    }

    const orders = await order_service.getOrdersByCustomerId(customerId);

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: error });
  }
});

app.get('/vendor_orders', authenticateuserData, async (req, res) => {
  try {
    const vendorId = req.userData.id;

    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID missing from token" });
    }

    const vendorOrders = await order_service.getOrdersByVendorId(vendorId);
    res.status(200).json({ orders: vendorOrders });
  } catch (error) {
    console.error("Failed to fetch vendor orders:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin_orders', authenticateuserData, async (req, res) => {
  try {
    const orders = await order_service.getAllOrders();

    const formattedOrders = orders.map(order => ({
      id: order.Order_ID || `#ORD-${order._id.toString().slice(-4)}`,
      customer: order.ShippingAddress?.Name || order.Customer_ID?.name || "Unknown",
      email: order.Customer_ID?.email || "Not provided",
      amount: `₹${order.Total_Amount.toFixed(2)}`,
      date: new Date(order.Order_Date).toISOString().split("T")[0],
      status: order.Status,
      items: order.Order_Items.length,
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Admin: Failed to fetch all orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin_orders/:id/status", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updatedOrder = await order_service.updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

app.put("/vendor_orders/:orderId/item/:productId/status", async (req, res) => {
  const { orderId, productId } = req.params;
  const { vendorId, status } = req.body;

  if (!vendorId || !status) {
    return res.status(400).json({ message: "Vendor ID and status are required" });
  }

  try {
    const updatedOrder = await order_service.updateProductStatusInOrder(orderId, productId, vendorId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order or item not found or not authorized" });
    }
    res.status(200).json({ message: "Product status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating product status" });
  }
});


// -------------------------------------------------------------------------------------------------------

/* STRIPE */
 
app.post('/create-payment-intent', authenticateuserData, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripeService.createPaymentIntent(amount);

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: 'Stripe error' });
  }
});

app.post('/create-checkout-session', authenticateuserData, async (req, res) => {
  try {
    const orderDetails = req.body;

    if (!Array.isArray(orderDetails.Order_Items) || orderDetails.Order_Items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderID = generateOrderId();
    orderDetails.Order_ID = orderID;

    await PendingOrder.create({ ...orderDetails });

    const session = await stripeService.createCheckoutSession(orderDetails);
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err.message);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

app.post('/confirm-order', authenticateuserData, async (req, res) => {
  const sessionId = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    if (!session.metadata || !session.metadata.orderId) {
      return res.status(400).json({ error: 'Invalid session metadata' });
    }

  const orderDetails = await PendingOrder.findOne({ Order_ID: session.metadata.orderId }).lean();
    if (!orderDetails) {
      return res.status(404).json({ error: 'Pending order not found' });
    }

    const finalOrder = await order_service.createOrderWithPayment(
      { ...orderDetails, Customer_ID: new mongoose.Types.ObjectId(orderDetails.Customer_ID) },
      session.payment_intent
    );

    await PendingOrder.deleteOne({ Order_ID: orderDetails.Order_ID });

    res.json({ success: true, order: finalOrder });
  } catch (err) {
    console.error("Failed to confirm order:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
//    console.log("✅ Webhook called");
//   const sig = req.headers['stripe-signature'];

//   let event;
//   try {
//     event = stripeService.verifyWebhook(req.body, sig);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//  if (event.type === 'checkout.session.completed') {
//     console.log("✅ Checkout session completed event received");
//     const session = event.data.object;
//     const { customerId, orderId, Total_Amount } = session.metadata;
//     const transactionId = session.payment_intent;

//     try {
//       const orderDetails = await PendingOrder.findOne({ Order_ID: orderId });
//       if (!orderDetails) {
//         throw new Error('Order not found in pending orders');
//       }
//        console.log("📝 Order Details Fetched:", orderDetails);

//       await order_service.createOrderWithPayment(orderDetails.toObject(), transactionId);
//       await PendingOrder.deleteOne({ Order_ID: orderId });
//       console.log('Order stored in DB successfully');
//     } catch (err) {
//       console.error('Order saving failed:', err.message);
//     }
//   }

//   res.sendStatus(200);
// });