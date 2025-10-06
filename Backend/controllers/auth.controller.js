import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../lib/db.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    const db = getDB();

    try {
        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user!" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Credentials Required!" });
        }
        
        const user = await db.collection("users").findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            { id: user._id, isAdmin: false },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        const { password: userPassword, ...userInfo } = user;

        res.cookie("token", token, {
                httpOnly: true,
                maxAge: age,
            })
            .status(200)
            .json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to login!" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};