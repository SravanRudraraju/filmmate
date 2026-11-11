import express from "express";
import bcrypt from "bcrypt"
import pool from "../db.js"
import jwt from "jsonwebtoken"
import "dotenv/config";
import crypto from "crypto";
import { Resend } from "resend";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router()

const resend = new Resend(process.env.RESEND_API_KEY)


router.post("/register", async (req, res) => {
    try {

        const { email, username, password } = req.body

        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const passwordLength = [...password].length
        const passwordBytes = Buffer.byteLength(password, "utf-8")
        if (passwordLength < 8) {
            return res.status(400).json({
                message: "password must be alteast 8 characters long"
            })
        }
        if (passwordBytes > 72) {
            return res.status(400).json({
                message: "password is too long"
            })
        }

        const existingEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email])

        if (existingEmail.rows.length > 0) {
            return res.status(409).json({ message: "email already exists" })
        }

        const existingUsername = await pool.query("SELECT id FROM users WHERE username = $1", [username])

        if (existingUsername.rows.length > 0) {
            return res.status(409).json({ message: "username already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const verificationToken = crypto.randomBytes(32).toString("hex")

        const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex")

        const result = await pool.query(`INSERT INTO users(email,username,password_hash,is_verified,verification_token_hash ,verification_token_expires_at) VALUES($1,$2,$3,false,$4, NOW() + INTERVAL '30 minutes') RETURNING id,email,username`, [email, username, hashedPassword, verificationTokenHash])

        const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Verify your CineMate email",
            html: `
                <h2>Welcome to CineMate!</h2>
                <p>Please verify your email address by clicking the link below.</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link expires in 30 minutes.</p>
             `,
            text: `Verify your CineMate email: ${verificationLink}`

        });
        if (error) {
            await pool.query(
                "DELETE FROM users WHERE id = $1",
                [result.rows[0].id]
            );

            console.error("Verification email failed:", error);

            return res.status(502).json({
                message: "Unable to send verification email. Please try again."
            });
        }

        return res.status(201).json({
            message: "Registration successful! Please check your email to verify your account."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }

})

router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;
        const verificationTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        if (!token) {
            return res.status(400).send("Verification token is missing.");
        }
        const result = await pool.query(
            `SELECT id FROM users
            WHERE verification_token_hash = $1
            AND verification_token_expires_at > NOW()
            AND is_verified = FALSE`,
            [verificationTokenHash]
        );
        if (result.rows.length === 0) {
            return res.status(400).send(
                "Invalid or expired verification link. Please register again or request a new verification email."
            );
        }
        await pool.query(
            `UPDATE users
            SET is_verified = TRUE,
            verification_token_hash = NULL,
            verification_token_expires_at = NULL
            WHERE id = $1`,
            [result.rows[0].id]
        );
        return res.status(200).send(`
            <h2>Email verified successfully!</h2>
            <p>Your CineMate account is now verified.</p>
            <p>You can return to CineMate and log in.</p>
        `);
    } catch (error) {
        console.error("Email verification failed:", error);
        return res.status(500).send("Something went wrong.");
    }
});

router.post("/login", async (req, res) => {
    try {

        const { login, password } = req.body
        if (!login || !password) {
            return res.status(400).json({
                message: "username/email and password are required"
            })
        }
        const result = await pool.query(`SELECT * FROM users WHERE username = $1 OR email = $1`, [login])
        const data = result.rows[0]
        if (!data) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        const passwordMatch = await bcrypt.compare(password, data.password_hash)
        if (!passwordMatch) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        if (!data.is_verified) {
            return res.status(403).json({
                message: "Please verify your email before logging in."
            });
        }
        const token = jwt.sign(
            { userId: data.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }

        )
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: data.id,
                username: data.username,
                email: data.email
            }
        })
    } catch (error) {
        console.error("Login failed:", error);

        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
})



export default router;