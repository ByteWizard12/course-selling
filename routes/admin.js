const express = require("express");
const { adminModel, userModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const bcrypt = require("bcrypt");
const z = require("zod");
const { adminMiddleware } = require("../middleware/admin");

const adminRouter = express.Router();

// Zod schema for admin signup
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
});

// Zod schema for admin signin
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Verify admin token
adminRouter.get("/verify", adminMiddleware, (req, res) => {
    res.json({ valid: true });
});

// Get all users
adminRouter.get("/users", adminMiddleware, async (req, res) => {
    try {
        const users = await userModel.find({})
            .select('-password')
            .lean()
            .exec();
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

adminRouter.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const admin = await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        
        const token = jwt.sign({ adminId: admin._id }, JWT_ADMIN_PASSWORD);
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

adminRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = signinSchema.parse(req.body);
        
        // Check if admin exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: "Admin account not found. Please sign up first." });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        const token = jwt.sign({ adminId: admin._id }, JWT_ADMIN_PASSWORD);
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

// Get all courses for admin
adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    try {
        const courses = await courseModel.find({ creatorId: req.userId });
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create new course
adminRouter.post("/course", adminMiddleware, async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body;
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: req.userId
        });
        res.json({ course });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete course
adminRouter.delete("/courses/:courseId", adminMiddleware, async (req, res) => {
    try {
        const course = await courseModel.findOneAndDelete({
            _id: req.params.courseId,
            creatorId: req.userId
        });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = { adminRouter };