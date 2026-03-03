import prisma from "../../../providers/database/database.provider";

export namespace AssignmentRepository {
  export const findAll = async () => {
    return await prisma.assignment.findMany({
      include: {
        evaluation: true,
        evaluator: true,
        evaluatee: true,
      }
    });
  };

  export const findById = async (id: string) => {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        evaluation: true,
        evaluator: true,
        evaluatee: true,
      }
    });
  };

  export const findByEvaluationId = async (evaluationId: string) => {
    return await prisma.assignment.findMany({
      where: { evaluationId },
      include: {
        evaluation: true,
        evaluator: true,
        evaluatee: true,
      }
    });
  };

  export const findByEvaluatorId = async (evaluatorId: string) => {
    return await prisma.assignment.findMany({
      where: { evaluatorId },
      include: {
        evaluation: true,
        evaluator: true,
        evaluatee: true,
      }
    });
  };

  export const findByEvaluateeId = async (evaluateeId: string) => {
    return await prisma.assignment.findMany({
      where: { evaluateeId },
      include: {
        evaluation: true,
        evaluator: true,
        evaluatee: true,
      }
    });
  };

  export const create = async (data: {
    evaluationId: string;
    evaluatorId: string;
    evaluateeId: string;
  }) => {
    return await prisma.assignment.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      evaluationId?: string;
      evaluatorId?: string;
      evaluateeId?: string;
    },
  ) => {
    return await prisma.assignment.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.assignment.delete({
      where: { id },
    });
  };
}
