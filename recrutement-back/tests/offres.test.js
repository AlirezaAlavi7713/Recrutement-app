import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

const request = supertest(app);

let recruteurToken;
let candidatToken;
let offreId;

const recruteur = { nom: "Dupont", prenom: "Jean", email: `recruteur.${Date.now()}@test.com`, password: "password123", role: "recruteur" };
const candidat = { nom: "Martin", prenom: "Marie", email: `candidat.${Date.now()}@test.com`, password: "password123", role: "candidat" };

after(async () => {
  await pool.end();
});

describe("Offres routes", () => {
  it("Setup — créer comptes recruteur et candidat", async () => {
    const r1 = await request.post("/api/auth/register").send(recruteur);
    assert.equal(r1.status, 201);
    recruteurToken = r1.body.token;

    const r2 = await request.post("/api/auth/register").send(candidat);
    assert.equal(r2.status, 201);
    candidatToken = r2.body.token;
  });

  it("GET /api/offres — accessible sans auth", async () => {
    const res = await request.get("/api/offres");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it("POST /api/offres — recruteur crée une offre", async () => {
    const res = await request.post("/api/offres")
      .set("Authorization", `Bearer ${recruteurToken}`)
      .send({ titre: "Dev React Test", description: "Description longue pour le test de validation minimum requis.", type_contrat: "CDI", domaine: "Informatique", ville: "Paris" });
    assert.equal(res.status, 201);
    offreId = res.body.id || res.body.offre?.id;
  });

  it("POST /api/offres — candidat ne peut pas créer une offre", async () => {
    const res = await request.post("/api/offres")
      .set("Authorization", `Bearer ${candidatToken}`)
      .send({ titre: "Test", description: "Desc", type_contrat: "CDI", domaine: "Informatique" });
    assert.equal(res.status, 403);
  });

  it("POST /api/offres — sans auth", async () => {
    const res = await request.post("/api/offres")
      .send({ titre: "Test", description: "Desc", type_contrat: "CDI", domaine: "Informatique" });
    assert.equal(res.status, 401);
  });

  it("POST /api/offres — description trop courte", async () => {
    const res = await request.post("/api/offres")
      .set("Authorization", `Bearer ${recruteurToken}`)
      .send({ titre: "Test", description: "Court", type_contrat: "CDI", domaine: "Informatique" });
    assert.equal(res.status, 400);
  });
});
