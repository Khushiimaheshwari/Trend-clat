import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    Order_ID: { type: String, required: true },
    Customer_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    PaymentMethod: { type: String, enum: ['COD + Online', 'Online'], required: true, },
    PaymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending', },
    Transaction_ID: { type: String,  default: null, },
    AmountPaid: { type: Number, required: true, min: [0, 'Amount must be positive'], },
    PaymentDate: { type: Date, default: Date.now, },
    Refunds: [{
      Refund_ID: String,
      Amount: Number,
      Date: Date,
      Reason: String,
    }]
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export class Payment_Service {

  // async processSuccessfulPayment(transactionId, orderDetails) {
  //   console.log("Payment schema");

  //   const payment = await Payment.create({
  //     Customer_ID: orderDetails.Customer_ID,
  //     PaymentMethod: "Online",
  //     PaymentStatus: "Completed",
  //     Transaction_ID: transactionId,
  //     AmountPaid: orderDetails.Total_Amount,
  //   });

  //   const order = await orderService.createOrder(orderDetails, payment._id);

  //   payment.Order_ID = order._id;
  //   await payment.save();

  //   return { payment, order };
  // }

}

const payment_service = new Payment_Service;
export default payment_service;

export { Payment };