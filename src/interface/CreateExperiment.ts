interface User {
  name: string;
  age: number;
  graduating: boolean;
  gender: string;
  portugueseSpeaker: boolean;
}

export interface Trial {
  responseTime: number;
  stimulus: string;
  timeElapsed: number;
  trialIndex: number;
  phrasePosition: number;
  phrase: string;
}

export interface QuestionsResponse {
  phrase: string;
  timeElapsed: number;
  correct: boolean;
}

export interface CreateExperiment {
  user: User;
  experiment: Trial[];
  questionsResponses: QuestionsResponse[];
}
