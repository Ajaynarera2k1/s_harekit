import PlanModel from '../model/plan.model.js'

export const fetchPlans = async (req, res)=>{
    try {
       const plans = await PlanModel.find().sort({createdAt: -1})
        res.status(200).json(plans)
    }
    catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}

export const createPlan = async (req, res)=>{
    try {
        const plan = new PlanModel(req.body)
        await plan.save()
        res.status(200).json(plan)
    }
    catch(err)
    {
        res.status(500).json({
            message: err.message
        })
    }
}