import bookingModel from "../model/bookingModel.js";


const bookingDetails = async (req,res) => {

    try {
        console.log(req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status:"error",
                message:"no data provided"
            })
        }

        const booking = await bookingModel.create(req.body)
        
        if (!booking) {
                return res.status(401).json({
                status:"error",
                message:"appointment booking unsuccessful"
            })
        }
        res.status(200).json({
            status:"successful",
            message:"appointment booked successfully",
            booking
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
    
}

export default bookingDetails