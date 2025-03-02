import { CreateExperiment } from "src/interface/CreateExperiment";
import ExperimentRepository from "src/repository/experiment";

export default class ExperimentService {
  constructor(private readonly experimentRepository: ExperimentRepository) {}

  async create(experimentData: CreateExperiment) {
    await this.experimentRepository.create(experimentData);
    return experimentData;
  }
}
