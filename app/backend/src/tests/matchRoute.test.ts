import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import App from "../app";
import { Response } from "superagent";
import { afterEach } from "mocha";
import MatchModel from "../database/models/MatchModel";
import {
  matchesMock,
  inProgressMatches,
  notInProgressMatches,
  match,
  updateMatch,
} from "./mocks/matchesMock";
import UserModel from "../database/models/UserModel";
import userAdmin from "./mocks/userAdminMock";
import { createMatch, incorrectCreateMatch, sameTeamsCreateMatch } from "./mocks/createMatchMock";
import TeamModel from "../database/models/TeamModel";
import teamsMock from "./mocks/teamsMock";

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe("Testes de integração matchRoute", () => {
  let chaiHttpResponse: Response;
  describe("Testes da rota /matches", function () {
    describe("Método get", function () {
      afterEach(sinon.restore);
      it("Verifica se ao fazer uma requisição, sem a query inProgress, todas as partidas são retornadas ", async function () {
        sinon
          .stub(MatchModel, "findAll")
          .resolves([...matchesMock] as MatchModel[]);

        chaiHttpResponse = await chai.request(app).get("/matches");

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(matchesMock);
      });

      it("Verifica se ao fazer uma requisição com a query inProgress true são retornadas as partidas com o campo inProgress true", async function () {
        sinon
          .stub(MatchModel, "findAll")
          .resolves([...inProgressMatches] as MatchModel[]);

        chaiHttpResponse = await chai
          .request(app)
          .get("/matches?inProgress=true");

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(inProgressMatches);
      });

      it("Verifica se ao fazer uma requisição com a query inProgress false são retornadas as partidas com o campo inProgress false", async function () {
        sinon
          .stub(MatchModel, "findAll")
          .resolves([...notInProgressMatches] as MatchModel[]);

        chaiHttpResponse = await chai
          .request(app)
          .get("/matches?inProgress=false");

        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(notInProgressMatches);
      });
    });

    describe("Método post", function() {
      let token: string;
      afterEach(sinon.restore);
      beforeEach(async () => {
        sinon.stub(UserModel, "findOne").resolves({ ...userAdmin } as UserModel);
        chaiHttpResponse = await chai.request(app).post("/login").send({
          email: "admin@admin.com",
          password: "secret_admin",
        });
  
        token = chaiHttpResponse.body.token;
        sinon.restore();
      });

      it("Verifica se é possível criar uma partida", async function () {
        sinon.stub(TeamModel, "findOne").resolves({ ...teamsMock[0] } as TeamModel);

        sinon.stub(MatchModel, "create").resolves({ ...createMatch, inProgress: true, } as MatchModel)

        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set({ Authorization: token })
          .send(createMatch);;

        expect(chaiHttpResponse.status).to.be.equal(201);
        expect(chaiHttpResponse.body).to.be.deep.equal({ ...createMatch, inProgress: true, });
      });

      it("Verifica se é retornado um erro ao tentar criar uma partida se o corpo da requisição estiver errado ", async function () {
        sinon.stub(TeamModel, "findOne").resolves({ ...teamsMock[0] } as TeamModel);

        sinon.stub(MatchModel, "create").resolves({ ...createMatch, inProgress: true, } as MatchModel)

        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set({ Authorization: token })
          .send(incorrectCreateMatch);;

        expect(chaiHttpResponse.status).to.be.equal(400);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
      });

      it("Verifica se é retornado um erro ao tentar criar uma partida se for enviado dois times com o mesmo id", async function () {
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set({ Authorization: token })
          .send(sameTeamsCreateMatch);;

        expect(chaiHttpResponse.status).to.be.equal(422);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
      });

      it("Verifica se é retornado um erro ao tentar criar uma partida com um id de time que não existe", async function () {
        sinon.stub(TeamModel, "findOne").resolves(null);
        chaiHttpResponse = await chai
          .request(app)
          .post("/matches")
          .set({ Authorization: token })
          .send(createMatch);;

        expect(chaiHttpResponse.status).to.be.equal(404);
        expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'There is no team with such id!' });
      });
    })
  });

  describe("Testes da rota /matches/:id/finish", function () {
    afterEach(sinon.restore);
    it("Verifica se é possivel finalizar uma partida que existe", async function () {
      sinon.stub(MatchModel, "findOne").resolves({ ...match } as MatchModel);

      sinon.stub(MatchModel, "update").resolves([1]);

      chaiHttpResponse = await chai.request(app).patch("/matches/2/finish");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: "Finished" });
    });

    it("Verifica se é retornado um erro ao tentar finalizar uma partida que não existe", async function () {
      sinon.stub(MatchModel, "findOne").resolves(null);

      chaiHttpResponse = await chai.request(app).patch("/matches/2222/finish");

      expect(chaiHttpResponse.status).to.be.equal(404);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        message: "Match not found",
      });
    });
  });

  describe("Testes da rota /matches/:id", function () {
    afterEach(sinon.restore);
    it("Verifica se é possível atualizar uma partida", async function () {
      sinon.stub(MatchModel, "findOne").resolves({ ...matchesMock[0] } as MatchModel );
      sinon.stub(MatchModel, "update").resolves([1] );

      chaiHttpResponse = await chai.request(app).patch("/matches/1/").send(updateMatch);

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        message: "Updated",
      });
    });
    it("Verifica se é retornado um erro ao passar um corpo de requisição errado", async function () {
      chaiHttpResponse = await chai.request(app).patch("/matches/1/").send({ dwahdwh: 1 });

      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.be.deep.equal({
        message: "All fields must be filled",
      });
    });

  });
});
