/*======= External Dependencies and Modules =======*/
import express, { Application, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
/*======= Internal Modules or Files =======*/
// Configuration
import { dev } from './config'
import { connectDB } from './config/db'

// Middlewares
import { errorHandler } from './middlewares/errorHandler'
// import myLogger from './middlewares/logger'

// Routes
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import orderRoutes from './routes/orderRoutes'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import cookieParser from 'cookie-parser'
import stripe, { Stripe } from 'stripe'
import { CustomRequest } from './types/userTypes'
import { saveOrder } from './services/orderServices'
import { createHTTPError } from './utils/createError'

const app: Application = express()


connectDB()

// Use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true}
))
// app.use(myLogger)
app.use(cookieParser())


// Use routes

app.use('/public',express.static('public'))
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

const stripeSecretKey = dev.strip.SEC_KEY;
const stripePublishKey = dev.strip.PUP_KEY;

app.get('/config',(req, res)=>{
res.send({
  PublishableKey: dev.strip.PUP_KEY
})
})
const stripeInstance = new stripe(stripeSecretKey);

app.post('/payment-intent', async(req, res) => {
  try{
const paymentIntent = await stripeInstance.paymentIntents.create({
  amount: req.body.amount || 1000, 
  currency: 'usd',
  automatic_payment_methods:{
    enabled: true
  }
});





console.log(paymentIntent.amount);
console.log(paymentIntent.payment_method_types);


res.send({clientSecret: paymentIntent.client_secret,payment: paymentIntent})
  }catch(err){
    res.send({
      error:{
        message:err
      }
    })

  }

})



// Default route
app.get('/', (req, res) => {
  res.send(
    'Welcome to our E-commerce API to use this API please refer to the documentation in our github repository'
  )
})

// Error handling
app.use((req, res, next) => {
  next(createHTTPError(404, 'Route Not Found'))
})

app.use(errorHandler)

export default app
