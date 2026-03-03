import prisma from "../../../providers/database/database.provider";

export namespace IndicatorEvidenceRepository {
  export const findAll = async () => {
    return await prisma.indicatorEvidence.findMany();
  };

  export const findById = async (id: string) => {
    return await prisma.indicatorEvidence.findUnique({
      where: { id },
    });
  };

  export const findByIndicatorId = async (indicatorId: string) => {
    return await prisma.indicatorEvidence.findMany({
      where: { indicatorId },
    });
  };

  export const findByEvaluateeId = async (evaluateeId: string) => {
    return await prisma.indicatorEvidence.findMany({
      where: { evaluateeId },
    });
  };

  export const create = async (data: {
    indicatorId: string;
    evaluateeId: string;
    filename: string;
  }) => {
    return await prisma.indicatorEvidence.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      filename?: string;
    },
  ) => {
    return await prisma.indicatorEvidence.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.indicatorEvidence.delete({
      where: { id },
    });
  };
}
