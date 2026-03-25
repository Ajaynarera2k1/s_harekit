import fs from 'fs'
import UserModel from '../model/user.model.js'
import crypto from 'crypto'
import PlanModel from '../model/plan.model.js'
import Razorpay from 'razorpay'
import { v4 as uniqueId } from 'uuid'

const razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const createOrder = async (req, res) => {
    try {
        const plan = await PlanModel.findById(req.body.planId)
        
        if (!plan)
            throw new Error("Failed to process your payment right now")

        const order = await razor.orders.create({
            amount: (plan.price * 100),
            currency: 'INR',
            receipt: 'SKT_' + uniqueId()
        })
        res.status(200).json(order)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const webhook = (req, res) => {
   
    const SUCCESS_EVENT = (process.env.NODE_ENV === "production" ? "payment.captured" : "payment.authorized")
    const FAILED_EVENT = "payment.failed"
    const razorpaySignature = req.headers['x-razorpay-signature']

    if (!razorpaySignature)
        return res.status(400).send("Unauthorized")

    const data = req.body
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(data))
        .digest('hex')

    if (razorpaySignature !== generatedSignature)
        return res.status(400).send("Unauthorized")

  

    if (data.event === SUCCESS_EVENT)
        return onPaymentSuccess(data, res)

    if (data.event === FAILED_EVENT)
        return onPaymentFailed(data, res)

    res.send("success")
}

const onPaymentSuccess = async (data, res) => {
    try {
        await UserModel.findByIdAndUpdate(data.payload.payment.entity.notes.user, {
            plan: data.payload.payment.entity.notes.plan
        })
        res.status(200).json({ message: 'Product added' })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}

const onPaymentFailed = async (data, res) => {
    try {
        throw new Error("Payment failed")
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}