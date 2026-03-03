import prisma from "../../../providers/database/database.provider";

export namespace IndicatorRepository {
  export const findAll = async () => {
    return await prisma.indicator.findMany();
  };

  export const findById = async (id: string) => {
    return await prisma.indicator.findUnique({
      where: { id },
    });
  };

  export const findByTopicId = async (topicId: string) => {
    return await prisma.indicator.findMany({
      where: { topicId },
    });
  };

  export const create = async (data: {
    topicId: string;
    name: string;
    description: string;
    IndicatorType: string;
    requiredEvidences: boolean;
    weight: number;
  }) => {
    return await prisma.indicator.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
      description?: string;
      IndicatorType?: string;
      requiredEvidences?: boolean;
      weight?: number;
    },
  ) => {
    return await prisma.indicator.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.indicator.delete({
      where: { id },
    });
  };
}
