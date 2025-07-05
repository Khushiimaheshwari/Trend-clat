import jwt from "jsonwebtoken";
import BlacklistedToken from "./blacklistModel.js";

const authenticateuserData = async (req, res, next) => {
    try {
        console.log("Checking cookies:", req.cookies);
        const token = req.cookies.token; 
 
        if (!token){
            console.log(" No token found in cookies");
            return res.status(401).json({ error: "Access denied. No token provided." });
        } 

        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted){
            console.log(" Token is blacklisted");
            return res.status(401).json({ error: "Token is invalid (logged out)" });
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(" Token verified. User data:", decoded);

        req.userData = decoded; 
        console.log("Token Pulled : ", token);
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authenticateuserData;