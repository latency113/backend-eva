import { Evaluation } from "./evaluation.schema";
import { EvaluationRepository } from "../../repositories/evaluation/evaluation.repository";

export namespace EvaluationService {
  export const findAll = async () => {
    const evaluations = await EvaluationRepository.findAll();
    return evaluations.map((evaluation) => ({
      ...evaluation,
      startDate: evaluation.startDate.toISOString(),
      endDate: evaluation.endDate.toISOString(),
      createdAt: evaluation.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const evaluation = await EvaluationRepository.findById(id);
    if (!evaluation) return null;
    return {
      ...evaluation,
      startDate: evaluation.startDate.toISOString(),
      endDate: evaluation.endDate.toISOString(),
      createdAt: evaluation.createdAt.toISOString(),
    };
  };

  export const create = async (data: Omit<Evaluation, "id" | "createdAt">) => {
    const newEvaluation = await EvaluationRepository.create({
      createdBy: data.createdBy,
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });
    return {
      ...newEvaluation,
      startDate: newEvaluation.startDate.toISOString(),
      endDate: newEvaluation.endDate.toISOString(),
      createdAt: newEvaluation.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<Evaluation, "id" | "createdAt">>
  ) => {
    const updatedEvaluation = await EvaluationRepository.update(id, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });
    return {
      ...updatedEvaluation,
      startDate: updatedEvaluation.startDate.toISOString(),
      endDate: updatedEvaluation.endDate.toISOString(),
      createdAt: updatedEvaluation.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await EvaluationRepository.deleteById(id);
  };
}
