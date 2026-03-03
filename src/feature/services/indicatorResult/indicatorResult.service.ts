import { IndicatorResult } from "./indicatorResult.schema";
import { IndicatorResultRepository } from "../../repositories/indicatorResult/indicatorResult.repository";

export namespace IndicatorResultService {
  export const findAll = async () => {
    const results = await IndicatorResultRepository.findAll();
    return results.map((result) => ({
      ...result,
      createdAt: result.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const result = await IndicatorResultRepository.findById(id);
    if (!result) return null;
    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
    };
  };

  export const findByIndicatorId = async (indicatorId: string) => {
    const results = await IndicatorResultRepository.findByIndicatorId(indicatorId);
    return results.map((result) => ({
      ...result,
      createdAt: result.createdAt.toISOString(),
    }));
  };

  export const findByAssignmentId = async (assignmentId: string) => {
    const results = await IndicatorResultRepository.findByAssignmentId(assignmentId);
    return results.map((result) => ({
      ...result,
      createdAt: result.createdAt.toISOString(),
    }));
  };

  export const create = async (data: Omit<IndicatorResult, "id" | "createdAt">) => {
    const newResult = await IndicatorResultRepository.create(data);
    return {
      ...newResult,
      createdAt: newResult.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<IndicatorResult, "id" | "createdAt" | "indicatorId" | "assignmentId">>
  ) => {
    const updatedResult = await IndicatorResultRepository.update(id, data);
    return {
      ...updatedResult,
      createdAt: updatedResult.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await IndicatorResultRepository.deleteById(id);
  };
}
