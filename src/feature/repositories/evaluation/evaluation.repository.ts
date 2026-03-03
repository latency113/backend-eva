import prisma from "../../../providers/database/database.provider";

export namespace EvaluationRepository {
  export const findAll = async () => {
    return await prisma.evaluation.findMany({
      include: {
        createdByUser: true,
        topics: true,
        assignments: true,
      },
    });
  };

  export const findById = async (id: string) => {
    return await prisma.evaluation.findUnique({
      where: { id },
      include: {
        createdByUser: true,
        topics: true,
        assignments: true,
      },
    });
  };

  export const create = async (data: {
    createdBy: string;
    name: string;
    startDate: Date;
    endDate: Date;
  }) => {
    return await prisma.evaluation.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) => {
    return await prisma.evaluation.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.evaluation.delete({
      where: { id },
    });
  };
}
