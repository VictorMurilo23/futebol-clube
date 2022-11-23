import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import App from "../app";
import TeamModel from "../database/models/TeamModel";
import { Response } from "superagent";
import teamsMock from "./mocks/teamsMock";
import { afterEach } from "mocha";

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe("Testes de integração teamRoute", () => {
  let chaiHttpResponse: Response;
  describe("Testes da rota /teams", function () {
    afterEach(sinon.restore);
    it("Verifica se ao fazer uma requisição todos os times são retornados", async function () {
      sinon.stub(TeamModel, "findAll").resolves([...teamsMock] as TeamModel[]);

      chaiHttpResponse = await chai.request(app).get("/teams");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock);
    });
  });

});
