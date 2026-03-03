import jwt from "jsonwebtoken";
import authModel from "../model/authModel.js";


const isLoggedIn = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized, token not found",
        });
    }   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await authModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized, user not found",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "error",
            message: "Unauthorized, invalid token",
        });
}
}
export default isLoggedIn;