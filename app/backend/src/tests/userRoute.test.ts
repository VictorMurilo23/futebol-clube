import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import App from "../app";
import UserModel from "../database/models/UserModel";
import { Response } from "superagent";
import userAdmin from "./mocks/userAdminMock";
import { afterEach } from "mocha";

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe("Testes de integração userRoute", () => {
  let chaiHttpResponse: Response;
  describe("Testes da rota /login", function () {
    afterEach(sinon.restore);
    it("Verifica se ao passar as informações corretas um token do tipo string é retornado", async function () {
      sinon.stub(UserModel, "findOne").resolves({ ...userAdmin } as UserModel);

      chaiHttpResponse = await chai.request(app).post("/login").send({
        email: "admin@admin.com",
        password: "secret_admin",
      });

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body.token).to.be.a("string");
    });

    it("Verifica se ao passar um email invalido é retornado um erro", async function () {
      chaiHttpResponse = await chai.request(app).post("/login").send({
        email: "hauhdwwuahuo",
        password: "secret_admin",
      });
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body.message).to.be.equal(
        "All fields must be filled"
      );
    });

    it("Verifica se ao passar um email que não existe no db é retornado um erro", async function () {
      sinon.stub(UserModel, "findOne").resolves(null);
      chaiHttpResponse = await chai.request(app).post("/login").send({
        email: "teste@teste.com",
        password: "secret_admin",
      });
      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body.message).to.be.equal(
        "Incorrect email or password"
      );
    });

    it("Verifica se é retornado um erro caso a senha colocada esteja diferença da armanezada no db", async function () {
      sinon.stub(UserModel, "findOne").resolves({ ...userAdmin } as UserModel);
      chaiHttpResponse = await chai.request(app).post("/login").send({
        email: "admin@admin.com",
        password: "eswaiodhwoa",
      });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body.message).to.be.equal(
        "Incorrect email or password"
      );
    });
  });

  describe("Testes da rota /login/validate", function () {
    let token: string;
    beforeEach(async () => {
      sinon.stub(UserModel, "findOne").resolves({ ...userAdmin } as UserModel);
      chaiHttpResponse = await chai.request(app).post("/login").send({
        email: "admin@admin.com",
        password: "secret_admin",
      });

      token = chaiHttpResponse.body.token;
      sinon.restore();
    });

    afterEach(sinon.restore);

    it("Verifica se ao passar um token com as informações de um admin, um objeto com a chave role e o valor admin é retornado", async function () {
      sinon.stub(UserModel, "findOne").resolves({ ...userAdmin } as UserModel);

      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate")
        .set({ Authorization: token });

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({ role: "admin" });
    });

    it("Verifica se ao passar um token com informações que não estão no db é retornado um erro", async function () {
      sinon.stub(UserModel, "findOne").resolves(null);

      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate")
        .set({ Authorization: token });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Incorrect email or password" });
    });

    it("Verifica se ao não passar um token é retornado um erro", async function () {
      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate");

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Token must be a valid token" });
    });

    it("Verifica se ao não passar um token invalido é retornado um erro", async function () {
      token = 'dadwa'
      chaiHttpResponse = await chai
        .request(app)
        .get("/login/validate")
        .set({ Authorization: token });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Token must be a valid token" });
    });
  });
});
