import prisma from "../../../providers/database/database.provider";

export namespace TopicRepository {
  export const findAll = async () => {
    return await prisma.topic.findMany({
      include: {
        createdByUser: true,
        evaluation: true,
        indicators: true,
      },
    });
  };

  export const findById = async (id: string) => {
    return await prisma.topic.findUnique({
      where: { id },
      include: {
        createdByUser: true,
        evaluation: true,
        indicators: true,
      },
    });
  };

  export const findByEvaluationId = async (evaluationId: string) => {
    return await prisma.topic.findMany({
      where: { evaluationId },
      include: {
        createdByUser: true,
        evaluation: true,
        indicators: true,
      },
    });
  };

  export const create = async (data: {
    evaluationId: string;
    name: string;
    description: string;
    createdBy: string;
  }) => {
    return await prisma.topic.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
      description?: string;
    },
  ) => {
    return await prisma.topic.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.topic.delete({
      where: { id },
    });
  };
}
