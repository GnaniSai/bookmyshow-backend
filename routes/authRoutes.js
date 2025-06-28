import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userSchema.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { userId: savedUser._id, email: savedUser.email, role: savedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

authRouter.post("/register-admin", async (req, res) => {
    try {
        const { name, email, password, phone, updateExisting = false } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            if (updateExisting) {
                existingUser.role = "admin";
                if (password) {
                    const saltRounds = 10;
                    existingUser.password = await bcrypt.hash(password, saltRounds);
                }
                if (name) existingUser.name = name;
                if (phone) existingUser.phone = phone;

                const updatedUser = await existingUser.save();

                const token = jwt.sign(
                    { userId: updatedUser._id, email: updatedUser.email, role: updatedUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "24h" }
                );

                return res.status(200).json({
                    message: "User updated to admin successfully",
                    token,
                    user: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                    },
                });
            } else {
                return res.status(400).json({ message: "User already exists. Use updateExisting: true to update role." });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "admin",
        });

        const savedAdmin = await newAdmin.save();

        const token = jwt.sign(
            { userId: savedAdmin._id, email: savedAdmin.email, role: savedAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            user: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email,
                role: savedAdmin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

export default authRouter; 