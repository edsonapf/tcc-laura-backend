import {
  CreateExperiment,
  QuestionsResponse,
  Trial,
} from "src/interface/CreateExperiment";
import pg from "pg";

export default class ExperimentRepository {
  constructor(private readonly dbClient: pg.Client) {}

  private formatQuestionsResponseQuery(
    questionsResponses: QuestionsResponse[],
    userId: number
  ) {
    let valuesQuery = "";
    let values: (string | number | boolean)[] = [];
    for (let i = 0; i < questionsResponses.length; i++) {
      const positionQuery = `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${
        i * 4 + 4
      })`;
      valuesQuery += `${positionQuery}${
        i + 1 < questionsResponses.length ? "," : ""
      }`;
      values = values.concat([
        questionsResponses[i].phrase,
        questionsResponses[i].timeElapsed,
        questionsResponses[i].correct,
        userId,
      ]);
    }

    return {
      query: `INSERT INTO questions_responses (phrase, time_elapsed, correct, user_id)
        VALUES ${valuesQuery}`,
      values,
    };
  }

  private formatTrialsQuery(trials: Trial[], userId: number) {
    let valuesQuery = "";
    let values: (string | number)[] = [];
    for (let i = 0; i < trials.length; i++) {
      const positionQuery = `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${
        i * 7 + 4
      }, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`;
      valuesQuery += `${positionQuery}${i + 1 < trials.length ? "," : ""}`;
      values = values.concat([
        trials[i].responseTime,
        trials[i].stimulus,
        trials[i].timeElapsed,
        trials[i].trialIndex,
        trials[i].phrasePosition,
        trials[i].phrase,
        userId,
      ]);
    }

    return {
      query: `
        INSERT INTO trials (response_time, stimulus, time_elapsed, trial_index, phrase_position, phrase, user_id)
              VALUES ${valuesQuery}
      `,
      values,
    };
  }

  async create(data: CreateExperiment) {
    try {
      const {
        user,
        experiment,
        questionsResponses: questionsResponsesData,
      } = data;
      await this.dbClient.query("BEGIN");
      const userInsertQuery = `
        INSERT INTO users (name, age, graduating, gender, portuguese_speaker)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
      `;
      const userValues = [
        user.name,
        user.age,
        user.graduating,
        user.gender,
        user.portugueseSpeaker,
      ];
      const userQuery = await this.dbClient.query(userInsertQuery, userValues);
      const userId = userQuery.rows[0].id;
      const trials = this.formatTrialsQuery(experiment, userId);
      const questionsResponses = this.formatQuestionsResponseQuery(
        questionsResponsesData,
        userId
      );
      await this.dbClient.query(trials.query, trials.values);
      await this.dbClient.query(
        questionsResponses.query,
        questionsResponses.values
      );
      await this.dbClient.query("COMMIT");
    } catch (error) {
      await this.dbClient.query("ROLLBACK");
      throw error;
    }
    return data;
  }
}
