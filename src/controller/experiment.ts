import { Request, Response } from "express";
import { CreateExperiment } from "src/interface/CreateExperiment";
import ExperimentService from "src/service/experiment";

export default class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  create = async (req: Request, res: Response) => {
    const { body }: { body: CreateExperiment } = req;
    await this.experimentService.create(body);
    res.send("create experiment");
  };
}
