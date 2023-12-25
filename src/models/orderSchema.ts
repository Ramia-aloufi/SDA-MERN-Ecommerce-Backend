/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IProduct } from '../types/productTypes'
import { IOrder, IPayment } from '../types/orderTypes'
import { number, object } from 'joi'
const PaymentSchema = new Schema<IPayment>(
  {
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Apple Pay'],
      default : 'Apple Pay'
    },
    amount: {
      type: Number,
      required: true,
    },
  })
const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity:{type:Number,require:true,trim:true}
    }
    ],
    payment:PaymentSchema,
    status:{type:String,enum:['Not Processed', 'Processed' ,'Shipped' ,'Delivered' ,'Canceled'] ,default:'Not Processed'}
  },
  { timestamps: true }
)
orderSchema.path('products').validate(function (value: IProduct['_id'][]) {
  return value.length >= 1
}, 'Must have at least one product')

export const Order = model<IOrder>('Order', orderSchema)
