import { IndicatorEvidence } from "./indicatorEvidence.schema";
import { IndicatorEvidenceRepository } from "../../repositories/indicatorEvidence/indicatorEvidence.repository";

export namespace IndicatorEvidenceService {
  export const findAll = async () => {
    const evidences = await IndicatorEvidenceRepository.findAll();
    return evidences.map((evidence) => ({
      ...evidence,
      createdAt: evidence.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const evidence = await IndicatorEvidenceRepository.findById(id);
    if (!evidence) return null;
    return {
      ...evidence,
      createdAt: evidence.createdAt.toISOString(),
    };
  };

  export const findByIndicatorId = async (indicatorId: string) => {
    const evidences = await IndicatorEvidenceRepository.findByIndicatorId(indicatorId);
    return evidences.map((evidence) => ({
      ...evidence,
      createdAt: evidence.createdAt.toISOString(),
    }));
  };

  export const findByEvaluateeId = async (evaluateeId: string) => {
    const evidences = await IndicatorEvidenceRepository.findByEvaluateeId(evaluateeId);
    return evidences.map((evidence) => ({
      ...evidence,
      createdAt: evidence.createdAt.toISOString(),
    }));
  };

  export const create = async (data: Omit<IndicatorEvidence, "id" | "createdAt">) => {
    const newEvidence = await IndicatorEvidenceRepository.create(data);
    return {
      ...newEvidence,
      createdAt: newEvidence.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<IndicatorEvidence, "id" | "createdAt" | "indicatorId" | "evaluateeId">>
  ) => {
    const updatedEvidence = await IndicatorEvidenceRepository.update(id, data);
    return {
      ...updatedEvidence,
      createdAt: updatedEvidence.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await IndicatorEvidenceRepository.deleteById(id);
  };
}
