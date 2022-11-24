import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import App from "../app";
import { Response } from "superagent";
import { afterEach } from "mocha";
import MatchModel from "../database/models/MatchModel";
import { matchesMock } from "./mocks/matchesMock";
import { leaderboard, leaderboardAway, leaderboardHome } from "./mocks/leaderboardMock";

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe("Testes de integração matchRoute", () => {
  let chaiHttpResponse: Response;
  describe("Testes da rota /leaderboard/home", function () {
    afterEach(sinon.restore);
    it("Verifica se ao fazer uma requisição, o leaderboard é retornado", async function () {
      sinon
        .stub(MatchModel, "findAll")
        .resolves([...matchesMock] as MatchModel[]);

      chaiHttpResponse = await chai.request(app).get("/leaderboard/home");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardHome);
    });
  });

  describe("Testes da rota /leaderboard/away", function () {
    afterEach(sinon.restore);
    it("Verifica se ao fazer uma requisição, o leaderboard é retornado", async function () {
      sinon
        .stub(MatchModel, "findAll")
        .resolves([...matchesMock] as MatchModel[]);

      chaiHttpResponse = await chai.request(app).get("/leaderboard/away");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardAway);
    });
  });

  describe("Testes da rota /leaderboard/", function () {
    afterEach(sinon.restore);
    it("Verifica se ao fazer uma requisição, o leaderboard é retornado", async function () {
      sinon
        .stub(MatchModel, "findAll")
        .resolves([...matchesMock] as MatchModel[]);

      chaiHttpResponse = await chai.request(app).get("/leaderboard");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(leaderboard);
    });
  });
});
