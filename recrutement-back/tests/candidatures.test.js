import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import supertest from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

const request = supertest(app);

let recruteurToken;
let candidatToken;
let candidatToken2;
let offreId;
let candidatureId;

after(async () => {
  await pool.end();
});

describe("Candidatures routes", () => {
  it("Setup — créer comptes et offre", async () => {
    const ts = Date.now();
    const r1 = await request.post("/api/auth/register").send({ nom: "Rec", prenom: "A", email: `rec.cand.${ts}@test.com`, password: "password123", role: "recruteur" });
    recruteurToken = r1.body.token;

    const r2 = await request.post("/api/auth/register").send({ nom: "Cand", prenom: "B", email: `cand.cand.${ts}@test.com`, password: "password123", role: "candidat" });
    candidatToken = r2.body.token;

    const r3 = await request.post("/api/auth/register").send({ nom: "Other", prenom: "C", email: `other.cand.${ts}@test.com`, password: "password123", role: "candidat" });
    candidatToken2 = r3.body.token;

    const ro = await request.post("/api/offres").set("Authorization", `Bearer ${recruteurToken}`)
      .send({ titre: "Poste test candidature", description: "Description longue pour candidature test ok.", type_contrat: "CDI", domaine: "Informatique" });
    offreId = ro.body.id || ro.body.offre?.id || (await request.get("/api/offres/mes-offres").set("Authorization", `Bearer ${recruteurToken}`)).body[0]?.id;
    assert.ok(offreId, "offreId doit être défini");
  });

  it("POST /api/candidatures — candidat postule", async () => {
    const res = await request.post("/api/candidatures")
      .set("Authorization", `Bearer ${candidatToken}`)
      .send({ offre_id: offreId, lettre_motivation: "Je suis très motivé." });
    assert.equal(res.status, 201);
  });

  it("POST /api/candidatures — candidature en double refusée", async () => {
    const res = await request.post("/api/candidatures")
      .set("Authorization", `Bearer ${candidatToken}`)
      .send({ offre_id: offreId, lettre_motivation: "Je suis encore motivé." });
    assert.equal(res.status, 409);
  });

  it("POST /api/candidatures — recruteur ne peut pas postuler", async () => {
    const res = await request.post("/api/candidatures")
      .set("Authorization", `Bearer ${recruteurToken}`)
      .send({ offre_id: offreId });
    assert.equal(res.status, 403);
  });

  it("GET /api/candidatures/offre/:id — recruteur voit ses candidatures", async () => {
    const res = await request.get(`/api/candidatures/offre/${offreId}`)
      .set("Authorization", `Bearer ${recruteurToken}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 1);
    candidatureId = res.body[0]?.id;
  });

  it("GET /api/candidatures/offre/:id — autre recruteur ne voit pas les candidatures", async () => {
    const other = await request.post("/api/auth/register").send({ nom: "Other", prenom: "Rec", email: `otherrec.${Date.now()}@test.com`, password: "password123", role: "recruteur" });
    const res = await request.get(`/api/candidatures/offre/${offreId}`)
      .set("Authorization", `Bearer ${other.body.token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

  it("PATCH /api/candidatures/:id/statut — recruteur change le statut", async () => {
    const res = await request.patch(`/api/candidatures/${candidatureId}/statut`)
      .set("Authorization", `Bearer ${recruteurToken}`)
      .send({ statut: "vue" });
    assert.equal(res.status, 200);
  });

  it("PATCH /api/candidatures/:id/statut — statut invalide refusé", async () => {
    const res = await request.patch(`/api/candidatures/${candidatureId}/statut`)
      .set("Authorization", `Bearer ${recruteurToken}`)
      .send({ statut: "invalide" });
    assert.equal(res.status, 400);
  });

  it("DELETE /api/candidatures/:id — candidat retire sa candidature", async () => {
    const res = await request.delete(`/api/candidatures/${candidatureId}`)
      .set("Authorization", `Bearer ${candidatToken}`);
    assert.equal(res.status, 200);
  });

  it("DELETE /api/candidatures/:id — autre candidat ne peut pas retirer", async () => {
    const rePost = await request.post("/api/candidatures")
      .set("Authorization", `Bearer ${candidatToken}`)
      .send({ offre_id: offreId });
    const rGet = await request.get(`/api/candidatures/offre/${offreId}`).set("Authorization", `Bearer ${recruteurToken}`);
    const newId = rGet.body[0]?.id;
    const res = await request.delete(`/api/candidatures/${newId}`)
      .set("Authorization", `Bearer ${candidatToken2}`);
    assert.equal(res.status, 403);
  });
});
