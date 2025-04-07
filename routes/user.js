const express = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const bcrypt = require("bcrypt");
const z = require("zod");
const { userMiddleware } = require("../middleware/user");

const userRouter = express.Router();

// Zod schema for user signup
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
});

// Zod schema for user signin
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

userRouter.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        
        const token = jwt.sign({ userId: user._id }, JWT_USER_PASSWORD);
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else if (error.code === 11000) {
            res.status(400).json({ error: "Email already exists" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

userRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = signinSchema.parse(req.body);
        
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Account not found. Please sign up first." });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_USER_PASSWORD);
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

// Purchase a course
userRouter.post("/courses/:courseId/purchase", userMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        // Check if user has already purchased the course
        const existingPurchase = await purchaseModel.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ error: "You have already purchased this course" });
        }

        // Create purchase record
        const purchase = await purchaseModel.create({
            userId,
            courseId
        });

        res.json({ message: "Course purchased successfully", purchase });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: "Failed to purchase course" });
    }
});

module.exports = {
    userRouter: userRouter
}