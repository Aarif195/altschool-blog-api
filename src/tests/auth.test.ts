import request from "supertest";
import mongoose from "mongoose";
import app from "../../server";
import dotenv from "dotenv";

dotenv.config();

// Use a separate test database
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || "mongodb://localhost:27017/blog_api_test";

beforeAll(async () => {
    await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Auth Endpoints", () => {
    // create a fresh user 

    describe("POST /api/auth/signup", () => {
        it("should create a new user", async () => {
            const res = await request(app)
                .post("/api/auth/signup")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
        });

        it("should not allow duplicate emails", async () => {
            // First signup
            await request(app)
                .post("/api/auth/signup")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "duplicate@example.com",
                    password: "password123"
                });

            // Second signup with same email
            const res = await request(app)
                .post("/api/auth/signup")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "duplicate@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeAll(async () => {
            // Create a user for login testing
            await request(app)
                .post("/api/auth/signup")
                .send({
                    first_name: "Login",
                    last_name: "User",
                    email: "login@example.com",
                    password: "password123"
                });
        });

        it("should login with valid credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });

        it("should reject invalid credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "login@example.com",
                    password: "wrongpassword"
                });

            expect(res.status).toBe(400);
        });
    });
});
