import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

const request = supertest(app);

const testUser = {
  nom: "Test",
  prenom: "User",
  email: `test.${Date.now()}@example.com`,
  password: "password123",
  role: "candidat",
};
let token;

after(async () => {
  await pool.end();
});

describe("Auth routes", () => {
  it("POST /api/auth/register — crée un compte", async () => {
    const res = await request.post("/api/auth/register").send(testUser);
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    token = res.body.token;
  });

  it("POST /api/auth/register — email déjà utilisé", async () => {
    const res = await request.post("/api/auth/register").send(testUser);
    assert.equal(res.status, 409);
  });

  it("POST /api/auth/register — email invalide", async () => {
    const res = await request.post("/api/auth/register").send({ ...testUser, email: "invalide" });
    assert.equal(res.status, 400);
  });

  it("POST /api/auth/register — mot de passe trop court", async () => {
    const res = await request.post("/api/auth/register").send({ ...testUser, email: "autre@test.com", password: "123" });
    assert.equal(res.status, 400);
  });

  it("POST /api/auth/login — connexion réussie", async () => {
    const res = await request.post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  it("POST /api/auth/login — mauvais mot de passe", async () => {
    const res = await request.post("/api/auth/login").send({ email: testUser.email, password: "wrong" });
    assert.equal(res.status, 401);
  });

  it("GET /api/auth/me — token valide", async () => {
    const res = await request.get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.email, testUser.email);
  });

  it("GET /api/auth/me — sans token", async () => {
    const res = await request.get("/api/auth/me");
    assert.equal(res.status, 401);
  });
});
