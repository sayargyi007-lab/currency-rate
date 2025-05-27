import { Exchange } from "../model/exchange.js"

export const getAllRates = async (req, res) => {
    try {
      const rates = await Exchange.find({}, 'currency buyRate sellRate updatedAt');
      res.status(200).json({ base: 'MMK', rates });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
  };
  

  export const updateRateController = async (req, res) => {
    const { rates } = req.body;
  
    if (!Array.isArray(rates) || rates.length === 0) {
      return res.status(400).json({ message: "Rate array is required" });
    }
  
    try {

  
      const updateRate = await Promise.all(
        rates.map(async (rate) => {
          const { currency, buyRate, sellRate } = rate;
          return await Exchange.findOneAndUpdate(
            { currency: currency.toUpperCase() },
            { buyRate, sellRate, updatedAt: new Date() },
            { upsert: true, new: true }
          );
        })
      );
  
      return res.status(200).json({ message: "Rates are updated Successfully", updated: updateRate });
    } catch (error) {
      console.error("Error updating rates:", error);
      return res.status(500).json({ message: "Error at updating rates" });
    }
  };
  

export const buyController = async(req,res)=>{
    try {
        const buyRate = await Exchange.find({},"currency buyRate")
        const result = {}
        buyRate.forEach(r=>result[r.currency]=r.buyRate)
        res.status(200).json({ base: 'MMK', date: new Date(), buyRates: result });
    } catch (error) {
        return res.status(500).json({message:"Fail to fetch buy rate"})
    }
}

export const sellController = async (req,res)=>{
    try {
        const sellRate = await Exchange.find({},"currency sellRate")
        const result = {}
        sellRate.forEach(r=>result[r.currency]=r.sellRate)
        res.status(200).json({base: "MMK", date: new Date(), sellRate: result})
    } catch (error) {
        return res.status(500).json({message:"Fail to fetch sell rate"})
    }
}

export const deleteController = async(req, res)=>{

    const {currency} = req.params
    if(!currency){
        return res.status(400).json({message:"Currency is required"})
    }

    try {
        await Exchange.findOneAndDelete({currency: currency.toUpperCase()})

        return res.status(200).json({message:`${currency} is deleted successfully`})

    } catch (error) {
        res.status(500).json({message:"Internal Server error at deleting currency"})
    }
}