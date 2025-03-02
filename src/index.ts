import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import ExperimentRepository from "./repository/experiment";
import ExperimentService from "./service/experiment";
import ExperimentController from "./controller/experiment";
import pg from "pg";
import cors from "cors";
import fs from "fs";

dotenv.config();

const server = express();
const port = process.env.PORT || 3000;
const dbClient = new pg.Client({
  user: "dev",
  password: "dev",
  port: 5433,
  database: "tcc_laura",
});
dbClient.connect();

server.use(bodyParser.json());
server.use(cors());
const phrases = [
  "Luiz/trabalha/na cidade/onde/vivem/seus avós",
  "Carol/fez/sua festa/onde/moram/seus pais",
  "Pedro/fez/sua tarefa/onde/pediu/ajuda a Mika",
  "Minha|mãe|é|muito|bonita",
  "Minha|colega|de sala|é|muito|inteligente",
  "Camila/saiu/de Cuba/onde/viveu/sete anos de vida",
  "O professor|de Sintaxe|é|legal",
  "Ele/foi/para casa/onde/mora/com sua família",
  "Maria/teve/uma infância/onde/foi/muito feliz",
  "Fui|ao cinema|ontem|com|meu namorado",
  "Eu|adoro|música|pop",
];
server.get("/", (_, res) => {
  const fileContent = phrases.map((phrase) => {
    const isFake = phrase.includes("|");
    const splittedPhrase = isFake ? phrase.split("|") : phrase.split("/");
    const stimulus = splittedPhrase.map((stimulu) => ({
      type: "HtmlKeyboardResponsePlugin",
      stimulus: stimulu,
      choices: " ",
    }));

    return {
      stimulus,
      fake: isFake,
      phrase: phrase.replace(/\/|\|/g, " "),
    };
  });
  fs.writeFileSync("experiments.json", JSON.stringify(fileContent));
  res.send("Tcc Laura");
});

const repository = new ExperimentRepository(dbClient);
const service = new ExperimentService(repository);
const controller = new ExperimentController(service);

server.post("/experiment", controller.create);

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
