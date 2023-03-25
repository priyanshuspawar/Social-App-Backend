const jwt = require("jsonwebtoken");

const verifyJWT = async (req,res,next)=>{
    try {
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if(!authHeader.startsWith('Bearer ')){
            return res.status(401).json({message:"Access denied"});
        }
        const token = authHeader.slice(7,authHeader.length).trimLeft();
        jwt.verify(token,process.env.JWT_SECRET,(error,decoded)=>{
            if(error) return res.status(409).json({message:`Access denied ${error.message}`});
        });
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = verifyJWT;