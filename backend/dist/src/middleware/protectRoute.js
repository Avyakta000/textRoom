import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401);
            throw new Error("Unauthorized - No token provided");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401);
            throw new Error("Unauthorized - Invalid Token");
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true, fullName: true, profilePic: true },
        });
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        // console.log("Error in protectRoute middleware", error.message);
        next(error);
    }
};
export default protectRoute;
