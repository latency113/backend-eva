import { Indicator } from "./indicator.schema";
import { IndicatorRepository } from "../../repositories/indicator/indicator.repository";

export namespace IndicatorService {
  export const findAll = async () => {
    const indicators = await IndicatorRepository.findAll();
    return indicators.map((indicator) => ({
      ...indicator,
      createdAt: indicator.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const indicator = await IndicatorRepository.findById(id);
    if (!indicator) return null;
    return {
      ...indicator,
      createdAt: indicator.createdAt.toISOString(),
    };
  };

  export const findByTopicId = async (topicId: string) => {
    const indicators = await IndicatorRepository.findByTopicId(topicId);
    return indicators.map((indicator) => ({
      ...indicator,
      createdAt: indicator.createdAt.toISOString(),
    }));
  };

  export const create = async (data: Omit<Indicator, "id" | "createdAt">) => {
    const newIndicator = await IndicatorRepository.create(data);
    return {
      ...newIndicator,
      createdAt: newIndicator.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<Indicator, "id" | "createdAt" | "topicId">>
  ) => {
    const updatedIndicator = await IndicatorRepository.update(id, data);
    return {
      ...updatedIndicator,
      createdAt: updatedIndicator.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await IndicatorRepository.deleteById(id);
  };
}
