import { Topic } from "./topic.schema";
import { TopicRepository } from "../../repositories/topic/topic.repository";

export namespace TopicService {
  export const findAll = async () => {
    const topics = await TopicRepository.findAll();
    return topics.map((topic) => ({
      ...topic,
      createdAt: topic.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const topic = await TopicRepository.findById(id);
    if (!topic) return null;
    return {
      ...topic,
      createdAt: topic.createdAt.toISOString(),
    };
  };

  export const findByEvaluationId = async (evaluationId: string) => {
    const topics = await TopicRepository.findByEvaluationId(evaluationId);
    return topics.map((topic) => ({
      ...topic,
      createdAt: topic.createdAt.toISOString(),
    }));
  };

  export const create = async (data: Omit<Topic, "id" | "createdAt">) => {
    const newTopic = await TopicRepository.create(data);
    return {
      ...newTopic,
      createdAt: newTopic.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<Topic, "id" | "createdAt" | "evaluationId" | "createdBy">>
  ) => {
    const updatedTopic = await TopicRepository.update(id, data);
    return {
      ...updatedTopic,
      createdAt: updatedTopic.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await TopicRepository.deleteById(id);
  };
}
