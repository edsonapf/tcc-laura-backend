import { Request, Response } from "express";
import { CreateExperiment } from "src/interface/CreateExperiment";
import ExperimentService from "src/service/experiment";

export default class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  create = async (req: Request, res: Response) => {
    const { body }: { body: CreateExperiment } = req;
    const name = body?.user?.name || "EMPTY ";
    console.log(
      `INFO - ${Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date())}: USER (${name})`
    );
    await this.experimentService.create(body);
    res.send("create experiment");
  };
}
