import prisma from "../../../providers/database/database.provider";

export namespace IndicatorResultRepository {
  export const findAll = async () => {
    return await prisma.indicatorResult.findMany({
      include: {
        indicator: true,
        assignment: true,
      }
    });
  };

  export const findById = async (id: string) => {
    return await prisma.indicatorResult.findUnique({
      where: { id },
      include: {
        indicator: true,
        assignment: true,
      }
    });
  };

  export const findByIndicatorId = async (indicatorId: string) => {
    return await prisma.indicatorResult.findMany({
      where: { indicatorId },
      include: {
        indicator: true,
        assignment: true,
      }
    });
  };

  export const findByAssignmentId = async (assignmentId: string) => {
    return await prisma.indicatorResult.findMany({
      where: { assignmentId },
      include: {
        indicator: true,
        assignment: true,
      }
    });
  };

  export const create = async (data: {
    indicatorId: string;
    assignmentId: string;
    score: number;
  }) => {
    return await prisma.indicatorResult.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      score?: number;
    },
  ) => {
    return await prisma.indicatorResult.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.indicatorResult.delete({
      where: { id },
    });
  };
}
