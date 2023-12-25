/*======= Internal Modules or Files =======*/
// Models
import { Order } from '../models/orderSchema'
// Types
import { IOrder } from '../types/orderTypes'
// Utils
import { createHTTPError } from '../utils/createError'


// update order
export const updateOrder = async (id: string, order: IOrder) => {
  const orderToValidate = new Order(order)
  await orderToValidate.validate()

  const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, order, { new: true })
  if (!updatedOrder) {
    throw createHTTPError(404, `order not found with id ${id}`)
  }
  return updatedOrder
}

// delete order
export const deleteOrder = async (id: string) => {
  const deletedOrder = await Order.findByIdAndDelete(id)
  if (!deletedOrder) {
    throw createHTTPError(404, `Order not found with id ${id}`)
  }
  return deletedOrder
}
export const saveOrder = async(order:IOrder,userId:string)=>{ 
  const newOrder = new Order({
    products: order.products,
    payment: order.payment,
    buyer: userId,
  })

  await newOrder.save()
  return newOrder
}

export const singleOrder = async(user_id:string | undefined)=>{
      const order = await Order.find({ buyer: user_id })
        .populate('buyer', 'name address phone -_id')
        .populate({ path: 'products', populate: { path: 'product', select: 'title price' } })
        if (!order) {
          throw createHTTPError(404, `Order with user: ${user_id} does not exist`)
        }
        return order
  
}

export const allOrders = async()=>{
  try {
    const orders = await Order.find()
      .populate('buyer', 'username -_id ')
      .populate({ path: 'products.product', select: 'title price' });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}
