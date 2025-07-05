import mongoose from "mongoose";
import { Product } from "./product_service.js";

const cartItemSchema = new mongoose.Schema({
  Product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, },
  Vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
  Size: { type: String, required: true },
  Color: { type: String, required: true },
  Quantity: { type: Number, required: true, min: 1 },
  Price: { type: Number, required: true}
});

const cartSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  Items: [cartItemSchema],
  SubTotal: { type: Number, required: true, default: 0 },
  Shipping: {
    type: mongoose.Schema.Types.Mixed, 
    default: 'Free'
  }
}, { timestamps: true });


const Cart = mongoose.model('Cart', cartSchema);

export class Cart_Service {

    async addToCart(userId, productId, vendorId, size, color, quantity = 1, price) {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");

        let cart = await Cart.findOne({ User: userId });

        if (!cart) {
            cart = new Cart({ User: userId, Items: [] });
        }

        const existingItem = cart.Items.find(
            item =>
                item.Product.toString() === productId &&
                item.Size === size &&
                item.Color === color
        );

        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            console.error("Invalid Vendor ID:", vendorId); 
            throw new Error("Invalid Vendor ID");
            }

        const vendorObjectId = new mongoose.Types.ObjectId(vendorId); 

        if (existingItem) {
            existingItem.Quantity += quantity;
        } else {
            cart.Items.push({
                Product: productId,
                Vendor: vendorObjectId,
                Size: size,
                Color: color,
                Quantity: quantity,
                Price: price,
            });
        }

        cart.SubTotal = cart.Items.reduce((total, item) => {
            return total + item.Quantity * item.Price;
        }, 0);

        cart.Shipping = await this.calculateShipping(cart.Items);

        await cart.save();
        return cart;
    }

    async removeFromCart(userId, productId, size, color) {
        const cart = await Cart.findOne({ User: userId });
        if (!cart) throw new Error("Cart not found");

        cart.Items = cart.Items.filter(
            item =>
                !(item._id.toString() === productId &&
                item.Size === size &&
                item.Color === color)
        );

        cart.SubTotal = cart.Items.reduce((total, item) => {
            return total + (item.Price * item.Quantity);
        }, 0);

        await cart.save();
        return cart;
    }

    async getCart(userId) {
        const cart = await Cart.findOne({ User: userId }).populate("Items.Product");
        if (!cart) return { Items: [] }; 
        return cart;
    }

    async updateQuantityInCart(userId, itemId, newQuantity) {
        const cart = await Cart.findOne({ User: userId });
        if (!cart) throw new Error("Cart not found");

        const item = cart.Items.find(i => i._id.toString() === itemId);
        if (!item) throw new Error("Item not found in cart");

        item.Quantity = newQuantity;
        
        cart.SubTotal = cart.Items.reduce((total, item) => {
            return total + item.Quantity * item.Price;
        }, 0);

        await cart.save();

        return cart;
    }

    async updateCartTotal(userId, newTotal) {
        const cart = await Cart.findOne({ User: userId });
        if (!cart) throw new Error("Cart not found");

        cart.SubTotal = newTotal;

        await cart.save();
        return cart;
    }

    async calculateShipping(cartItems) {
        let maxCharge = 0;
        for (const item of cartItems) {
            const product = await Product.findById(item.Product).lean();
            if (!product || !product.Delivery) continue;

            for (const delivery of product.Delivery) {
            if (delivery.Condition === '$price delivery charge') {
                maxCharge = Math.max(maxCharge, delivery.ConditionValue || 0);
            }
            }
        }

        return maxCharge > 0 ? maxCharge : 'Free'; 
    }

}

export const cartService = new Cart_Service();
export { Cart };