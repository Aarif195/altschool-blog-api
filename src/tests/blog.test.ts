import request from "supertest";
import mongoose from "mongoose";
import app from "../../server";
import dotenv from "dotenv";

dotenv.config();

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || "mongodb://localhost:27017/blog_api_test";

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_MONGO_URI);
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Blog Endpoints", () => {
    let token: string;
    let userId: string;
    let otherToken: string;
    let otherUserId: string;
    let blogId: string;

    beforeAll(async () => {
        // Create main user
        const userRes = await request(app).post("/api/auth/signup").send({
            first_name: "Blog",
            last_name: "Owner",
            email: "owner@example.com",
            password: "password123"
        });

        // Login to get token
        const loginRes = await request(app).post("/api/auth/login").send({
            email: "owner@example.com",
            password: "password123"
        });
        token = loginRes.body.token;
        const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = decoded.id; 

        console.log("TEST USER ID:", userId);

        // Create another user
        await request(app).post("/api/auth/signup").send({
            first_name: "Other",
            last_name: "User",
            email: "other@example.com",
            password: "password123"
        });
        const otherLogin = await request(app).post("/api/auth/login").send({
            email: "other@example.com",
            password: "password123"
        });
        otherToken = otherLogin.body.token;
    });

    describe("POST /api/blogs", () => {
        it("should create a blog in draft state", async () => {
            const res = await request(app)
                .post("/api/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "My First Blog",
                    description: "Description",
                    body: "This is the body of the blog which determines reading time.",
                    tags: ["tech", "life"]
                });

            expect(res.status).toBe(201);
            expect(res.body.blog).toHaveProperty("_id");
            expect(res.body.blog.state).toBe("draft");
            expect(res.body.blog.read_count).toBe(0);
            expect(res.body.blog.author).toBeDefined();
            blogId = res.body.blog._id;
        });

        it("should fail without auth token", async () => {
            const res = await request(app)
                .post("/api/blogs")
                .send({ title: "No Auth" });
            expect(res.status).toBe(400); // Unauthorized
        });
    });

    describe("GET /api/blogs (Public)", () => {
        it("should return published blogs (default)", async () => {
            const res = await request(app).get("/api/blogs");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.blogs)).toBe(true);
            // Should be empty initially as we only have a draft
            expect(res.body.blogs.length).toBe(0);
        });

        it("should not return drafts to public", async () => {
            const res = await request(app).get("/api/blogs?state=draft");
            expect(res.status).toBe(400); // "Unauthorized: Login to view drafts"
        });
    });

    describe("GET /api/blogs (Authenticated)", () => {
        it("should return owner's drafts", async () => {
            const res = await request(app)
                .get("/api/blogs?state=draft")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.blogs.length).toBeGreaterThan(0);
            expect(res.body.blogs[0]._id).toBe(blogId);
        });

        it("should not return other user's drafts", async () => {
            const res = await request(app)
                .get("/api/blogs?state=draft")
                .set("Authorization", `Bearer ${otherToken}`);

            expect(res.status).toBe(200);
            expect(res.body.blogs.length).toBe(0); 
        });
    });

    describe("PUT /api/blogs/:id", () => {
        it("should allow owner to update blog to published", async () => {
            const res = await request(app)
                .put(`/api/blogs/${blogId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ state: "published" });

            expect(res.status).toBe(200);
            expect(res.body.blog.state).toBe("published");
        });

        it("should not allow other user to update blog", async () => {
            const res = await request(app)
                .put(`/api/blogs/${blogId}`)
                .set("Authorization", `Bearer ${otherToken}`)
                .send({ title: "Hacked" });

            expect(res.status).toBe(400); // Unauthorized
        });
    });

    describe("GET /api/blogs/:id", () => {
        it("should return published blog to public", async () => {
            const res = await request(app).get(`/api/blogs/${blogId}`);
            expect(res.status).toBe(200);
            expect(res.body.blog._id).toBe(blogId);
            expect(res.body.blog.read_count).toBe(1); // Increment check
        });

        it("should increment read_count on view", async () => {
            // View again
            const res = await request(app).get(`/api/blogs/${blogId}`);
            expect(res.body.blog.read_count).toBe(2);
        });
    });

    describe("DELETE /api/blogs/:id", () => {
        it("should allow owner to delete blog", async () => {
            const res = await request(app)
                .delete(`/api/blogs/${blogId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(204);
        });

        it("should return 404 for deleted blog", async () => {
            const res = await request(app).get(`/api/blogs/${blogId}`);
            expect(res.status).toBe(400); // "Blog not found" 
        });
    });
});
