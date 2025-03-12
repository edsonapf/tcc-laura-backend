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
  user: process.env.DB_USER || "dev",
  password: process.env.DB_PASS || "dev",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5433,
  database: process.env.DB_NAME || "tcc_laura",
  host: process.env.DB_HOST || "localhost",
  ssl: true,
});
dbClient.connect();

server.use(bodyParser.json());
server.use(cors());
// [].sort(() => Math.random() - 0.5)
// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
// const phrases = [
//   "Luiz/trabalha/na cidade/onde/vivem/seus avós$pergunta?&sim*,não",
//   "Carol/fez/sua festa/onde/moram/seus pais$pergunta?&sim*,não",
//   "Pedro/fez/sua tarefa/onde/pediu/ajuda a Mika$pergunta?&sim*,não",
//   "Minha|mãe|é|muito|bonita$pergunta?&sim*,não",
//   "Minha|colega|de sala|é|muito|inteligente$pergunta?&sim*,não",
//   "Camila/saiu/de Cuba/onde/viveu/sete anos de vida$pergunta?&sim*,não",
//   "O professor|de Sintaxe|é|legal$pergunta?&sim*,não",
//   "Ele/foi/para casa/onde/mora/com sua família$pergunta?&sim*,não",
//   "Maria/teve/uma infância/onde/foi/muito feliz$pergunta?&sim*,não",
//   "Fui|ao cinema|ontem|com|meu namorado$pergunta?&sim*,não",
//   "Eu|adoro|música|pop$pergunta?&sim*,não",
// ];
server.get("/", (_, res) => {
  // const fileContent = phrases.map((item) => {
  //   const isFake = item.includes("|");
  //   const [phrase, questionAndAnswers] = item.split("$");
  //   const splittedPhrase = isFake ? phrase.split("|") : phrase.split("/");
  //   const stimulus = splittedPhrase.map((stimulu) => ({
  //     type: HtmlKeyboardResponsePlugin,
  //     stimulus: stimulu,
  //     choices: SPACE,
  //   }));
  //   const [question, answers] = questionAndAnswers.split("&");
  //   const [firstAnswer, secondAnswer] = answers.split(",");

  //   return {
  //     stimulus,
  //     fake: isFake,
  //     phrase: phrase.replace(/\/|\|/g, " "),
  //     question,
  //     answers: [
  //       {
  //         answer: firstAnswer.replace("*", ""),
  //         isCorrect: firstAnswer.includes("*"),
  //       },
  //       {
  //         answer: secondAnswer.replace("*", ""),
  //         isCorrect: secondAnswer.includes("*"),
  //       },
  //     ],
  //   };
  // });
  // fs.writeFileSync("experiments.txt", JSON.stringify(fileContent));
  res.send("Tcc Laura");
});

const repository = new ExperimentRepository(dbClient);
const service = new ExperimentService(repository);
const controller = new ExperimentController(service);

server.post("/experiment", controller.create);

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
