import mongoose from "mongoose";
import { Payment } from "./payment_service.js";

const orderSchema = new mongoose.Schema(
    {
        Order_ID: { type: String, required: true },
        Customer_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        Order_Date: { type: Date, default: Date.now },
        Delivery_Date: { type: Date },
        Tracking_ID: { type: String },
        Order_Items: [
            {
                Product_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                Vendor_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                Product_Name: { type: String, required: true },
                Product_Qty: { type: Number, required: true, default: 1 },
                Product_Size: { type: String },
                Product_Price: { type: String, required: true },
                Product_Color: { type: String },
                Product_Image: [
                  {
                    Url: { type: String, required: true },
                    Alt: { type: String },
                  },
                ],
                Product_Status: { type: String, enum: ['Processing', 'Dispatched', 'Delivered', 'Returned', 'Refund Generated'], default: 'Processing', },

            }
        ],
        Total_Items: { type: Number, required: true },
        Total_Amount: { type: Number, min: [0, 'Amount must be positive'], required: true },
        CouponCode: { type: String, default: null, },
        DiscountAmount: { type: Number, default: 0, min: [0, 'Discount cannot be negative'], },
        Status: { type: String, enum: ['Processing', 'Dispatched', 'Delivered', 'Returned', 'Refund Generated'], default: 'Processing', },
        Payment_Status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending', },
        Payment_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', },
        ShippingAddress: {
            Name: { type: String, required: true },
            Phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        Notes: { type: String, default: '', },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export const generateOrderId = () => {
  const prefix = "ORD";
  const timestamp = Date.now(); 
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};


export class Order_Service {
    
    async createOrderWithPayment(orderDetails, transactionId) {
    console.log("Order schema");
    console.log(orderDetails);
    
    const trackingId = `TRK-${Date.now()}`;
    const orderID = orderDetails.Order_ID;

    const payment = await Payment.create({
      Order_ID: orderID,
      Customer_ID: orderDetails.Customer_ID,
      PaymentMethod: "Online",
      PaymentStatus: "Completed",
      Transaction_ID: transactionId,
      AmountPaid: orderDetails.Total_Amount,
    });

    const order = await Order.create({
      ...orderDetails,
      Order_ID: orderID,
      Tracking_ID: trackingId,
      Payment_ID: payment._id,
      Payment_Status: "Completed",
    });

    await payment.save();

    return order;
  }

  async getOrdersByCustomerId(customerId) {
    try {
      const orders = await Order.find({ Customer_ID: customerId })
        .sort({ Order_Date: -1 });

      return orders;
    } catch (error) {
      console.error("Error fetching orders by customer ID:", error);
      throw error;
    }
  }

  async getOrdersByVendorId(vendorId) {
    try {
      const orders = await Order.find()
      .populate('Customer_ID', 'Name Email')
      .populate({
        path: 'Order_Items.Product_ID',
        model: 'Product',
        select: '_id Name Images',
      });

      const filteredOrders = [];

      for (const order of orders) {
        const vendorItems = order.Order_Items.filter(item => {
          return item.Vendor_ID?.toString() === vendorId.toString();
        });

        if (vendorItems.length > 0) {
          const orderCopy = order.toObject();
          orderCopy.Order_Items = vendorItems;
          filteredOrders.push(orderCopy);
        }
      }

      return filteredOrders;
    } catch (error) {
      console.error("Error fetching orders by vendor ID:", error);
      throw error;
    }
  }

async getAllOrders() {
  try {
    const orders = await Order.find()
      .sort({ Order_Date: -1 })
      .populate("Customer_ID", "name email"); 

    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}

async updateOrderStatus(orderId, newStatus) {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { Order_ID: orderId },
      { Status: newStatus },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

async updateProductStatusInOrder(orderId, productId, vendorId, newStatus) {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        Order_ID: orderId,
        "Order_Items.Product_ID": productId,
        "Order_Items.Vendor_ID": vendorId
      },
      {
        $set: {
          "Order_Items.$.Product_Status": newStatus
        }
      },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
}

}

const order_service = new Order_Service;
export default order_service;

export { Order };

const PendingOrderSchema = new mongoose.Schema({
  Order_ID: String,
  Customer_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  Total_Amount: Number,
  Order_Items: Array,
  Total_Items: Number,
  ShippingAddress: Object,
}, { timestamps: true });

export const PendingOrder = mongoose.model('PendingOrder', PendingOrderSchema);
