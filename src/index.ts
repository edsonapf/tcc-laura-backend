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
// const phrases = [
//   "Luiz/trabalha/na cidade/onde/vivem/seus avós$Luiz trabalha onde vivem seus pais?&sim,não*",
//   "João/foi/para casa/onde/mora/com sua família$João mora com sua família?&sim*,não",
//   "Carla/está/na academia/onde/treina/frequentemente$Carla treina frequentemente?&sim*,não",
//   "Amanda/irá/à UFPB/onde/estuda/Letras$Amanda estuda Artes?&sim,não*",
//   "Edson/está/em casa/onde/trabalha/remoto$Edson está no shopping?&sim,não*",
//   "Bianca/foi/ao restaurante/onde/comeu/panqueca$Bianca comeu pizza?&sim,não*",
//   "Lívia/foi/à piscina/onde/fez/natação$Lívia foi à praia?&sim,não*",
//   "Lavínia/foi/ao shopping/onde/fez/compras$Lavínia foi ao shopping?&sim*,não",
//   "Carol/fez/sua festa/onde/todos/se divertiram$Carol fez compras?&sim,não*",
//   "Pedro/fez/sua tarefa/onde/achou/difícil$Pedro fez sua tarefa?&sim*,não",
//   "Maria/teve/uma infância/onde/foi/muito feliz$Maria foi feliz durante sua infância?&sim*,não",
//   "Yasmin/ganhou/a camisa/onde/gostou/da cor$Yasmin odiou a cor?&sim,não*",
//   "Tarcísio/assistiu/ao filme/onde/o ator/era ruim$Tarcísio assistiu ao filme?&sim*,não",
//   "Ruan/teve/um sonho/onde/encontrou/amigos$Ruan sonhou com sua mãe?&sim,não*",
//   "Paula/comemorou/o aniversário/onde/todos/beberam$Paula comemorou o aniversário?&sim*,não",
//   "Mika/foi/à aula/onde/aprendeu/conteúdos$Mika faltou a aula?&sim,não*",
//   "Minha|mãe|é|muito|bonita$Minha mãe é feia?&sim,não*",
//   "Minha|colega|de sala|é|muito|inteligente$Minha colega é inteligente?&sim*,não",
//   "O professor|de Sintaxe|é|legal$O professor é legal?&sim*,não",
//   "Fui|ao cinema|ontem|com|meu namorado$Fui ao mercado?&sim,não",
//   "Eu|adoro|música|pop$Eu adoro rock?&sim,não*",
//   "O afilhado|do meu namorado|é|muito fofo$Meu namorado é fofo?&sim,não*",
//   "Ela|foi|à aula|hoje$Ela foi à aula?&sim*,não",
//   "Ele|é|muito|estudioso$Ele é preguiçoso?&sim,não*",
//   "Elas|são|estudantes|de Psicologia$Elas estudam Direito?&sim,não*",
//   "Lília|é|minha colega|de turma$Lília trouxe flores?&sim,não*",
//   "O capítulo|da novela|ontem|foi|chato$O capítulo foi chato?&sim*,não",
//   "Eu|adoro|ir|à praia$Eu adoro ir à praia?&sim*,não",
//   "Vamos almoçar|naquele restaurante|que eu falei?$Ela jantou naquele restaurante?&sim,não*",
//   "Eu|adoraria|sair|com você$Eu não quero sair?&sim,não*",
//   "Minha série|preferida|é|Friends$Minha série preferida é Friends?&sim*,não",
//   "Bia|foi|ao supermercado$Bia foi ao shopping?&sim,não*",
//   "Meu cachorro|é|muito|bagunceiro$Meu gato é bagunceiro?&sim,não*",
//   "Eu|adoro|ler|livros$Eu adoro ler livros?&sim*,não",
//   "Amo|estudar|libras$Eu amo estudar inglês?&sim,não*",
//   "Tenho|prova|semana que vem$Tenho prova na próxima semana?&sim*,não",
//   "Ana|é|muito linda$Ana é linda?&sim*,não",
//   "Victória|se formou|semestre|passado$Victória se formou?&sim*,não",
//   "Eu|odeio|as aulas|de literatura$Eu gosto das aulas de literatura?&sim,não*",
//   "Meu|professor|também|é|escritor$Meu professor é nadador?&sim,não*",
//   "Adoro|assistir|filmes e séries$Adoro assistir?&sim*,não",
//   "Saí|para|passear|com|meu cachorro$Saí com meu cachorro?&sim*,não",
//   "Comprei|um|celular|novo$Comprei um tablet?&sim,não*",
//   "Preciso|renovar|minha|habilitação$Preciso pegar meu passaporte?&sim,não*",
//   "Irei|à aula|hoje|na UFPB$Irei à aula hoje?&sim*,não",
//   "Esqueci|minha|garrafa|de água|na academia$Esqueci minha garrafa?&sim*,não",
// ];

// const phrases = [
//   "Meu|cachorro|está|doente$Meu cavalo está doente?&sim,não*",
//   "Visitei|minha|tia|que|está|doente$Minha tia está doente?&sim*,não",
//   "Duda|trabalha|com|Júlia|em|uma loja$Duda e Júlia trabalham juntas?&sim*,não",
//   "Carolina|fez|15 anos|semana|passada$Carolina fez 15 anos?&sim*,não",
//   "Quero|ir|em|uma|hamburgueria|nova$Quero ir em uma pizzaria?&sim,não*",
//   "Meu|namorado|me|trouxe|chocolate$Meu namorado me trouxe pipoca?&sim,não*",
// ];
server.get("/", (_, res) => {
  // const fileContent = phrases.map((item) => {
  //   const isFake = item.includes("|");
  //   const [phrase, questionAndAnswers] = item.split("$");
  //   const splittedPhrase = isFake ? phrase.split("|") : phrase.split("/");
  //   const stimulus = splittedPhrase.map((stimulu) => ({
  //     type: "HtmlKeyboardResponsePlugin",
  //     stimulus: stimulu,
  //     choices: "SPACE",
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
  // fs.writeFileSync(
  //   "experiments.txt",
  //   JSON.stringify(fileContent)
  //     .replace(/"HtmlKeyboardResponsePlugin"/g, "HtmlKeyboardResponsePlugin")
  //     .replace(/"SPACE"/g, "SPACE")
  // );
  res.send("Tcc Laura");
});

const repository = new ExperimentRepository(dbClient);
const service = new ExperimentService(repository);
const controller = new ExperimentController(service);

server.post("/experiment", controller.create);

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
