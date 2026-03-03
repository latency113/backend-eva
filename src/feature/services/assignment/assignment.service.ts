import { Assignment } from "./assignment.schema";
import { AssignmentRepository } from "../../repositories/assignment/assignment.repository";

export namespace AssignmentService {
  export const findAll = async () => {
    const assignments = await AssignmentRepository.findAll();
    return assignments.map((assignment: any) => ({
      ...assignment,
      evaluatorName: assignment.evaluator?.name || "",
      evaluateeName: assignment.evaluatee?.name || "",
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const assignment = await AssignmentRepository.findById(id) as any;
    if (!assignment) return null;
    return {
      ...assignment,
      evaluatorName: assignment.evaluator?.name || "",
      evaluateeName: assignment.evaluatee?.name || "",
      createdAt: assignment.createdAt.toISOString(),
    };
  };

  export const findByEvaluationId = async (evaluationId: string) => {
    const assignments = await AssignmentRepository.findByEvaluationId(evaluationId);
    return assignments.map((assignment: any) => ({
      ...assignment,
      evaluatorName: assignment.evaluator?.name || "",
      evaluateeName: assignment.evaluatee?.name || "",
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const findByEvaluatorId = async (evaluatorId: string) => {
    const { default: prisma } = require("../../../providers/database/database.provider");
    const assignments = await prisma.assignment.findMany({
      where: { evaluatorId },
      include: {
        evaluation: {
          include: { topics: { include: { indicators: true } } }
        },
        evaluator: true,
        evaluatee: true,
        indicatorResults: true,
      }
    });

    return assignments.map((assignment: any) => {
      let totalIndicators = 0;
      let totalScore = 0;
      let maxPossibleScore = 0;

      const resultsMap = new Map();
      assignment.indicatorResults.forEach((r: any) => resultsMap.set(r.indicatorId, r.score));

      assignment.evaluation.topics.forEach((t: any) => {
        totalIndicators += t.indicators.length;
        t.indicators.forEach((ind: any) => {
          maxPossibleScore += ind.weight;
          const scoreGiven = resultsMap.get(ind.id) ?? null;
          if (scoreGiven !== null) {
            const type = (ind.IndicatorType || ind.type || "").toUpperCase();
            if (type === "SCALE_1_4" || type === "SCALE 1-4") {
              totalScore += (scoreGiven / 4) * ind.weight;
            } else if (type === "YES_NO" || type === "YES/NO") {
              totalScore += scoreGiven > 0 ? ind.weight : 0;
            }
          }
        });
      });
      const gradedIndicators = assignment.indicatorResults.length;

      return {
        ...assignment,
        evaluatorName: assignment.evaluator?.name || "",
        evaluateeName: assignment.evaluatee?.name || "",
        totalIndicators,
        gradedIndicators,
        totalScorePercentage: maxPossibleScore > 0 ? Number(((totalScore / maxPossibleScore) * 100).toFixed(2)) : 0,
        createdAt: assignment.createdAt.toISOString(),
      };
    });
  };

  export const findByEvaluateeId = async (evaluateeId: string) => {
    const { default: prisma } = require("../../../providers/database/database.provider");
    const assignments = await prisma.assignment.findMany({
      where: { evaluateeId },
      include: {
        evaluation: {
          include: { topics: { include: { indicators: true } } }
        },
        evaluator: true,
        evaluatee: true,
        indicatorResults: true,
      }
    });

    return assignments.map((assignment: any) => {
      let totalIndicators = 0;
      let totalScore = 0;
      let maxPossibleScore = 0;

      const resultsMap = new Map();
      assignment.indicatorResults.forEach((r: any) => resultsMap.set(r.indicatorId, r.score));

      assignment.evaluation.topics.forEach((t: any) => {
        totalIndicators += t.indicators.length;
        t.indicators.forEach((ind: any) => {
          maxPossibleScore += ind.weight;
          const scoreGiven = resultsMap.get(ind.id) ?? null;
          if (scoreGiven !== null) {
            const type = (ind.IndicatorType || ind.type || "").toUpperCase();
            if (type === "SCALE_1_4" || type === "SCALE 1-4") {
              totalScore += (scoreGiven / 4) * ind.weight;
            } else if (type === "YES_NO" || type === "YES/NO") {
              totalScore += scoreGiven > 0 ? ind.weight : 0;
            }
          }
        });
      });
      const gradedIndicators = assignment.indicatorResults.length;

      return {
        ...assignment,
        evaluatorName: assignment.evaluator?.name || "",
        evaluateeName: assignment.evaluatee?.name || "",
        totalIndicators,
        gradedIndicators,
        totalScorePercentage: maxPossibleScore > 0 ? Number(((totalScore / maxPossibleScore) * 100).toFixed(2)) : 0,
        createdAt: assignment.createdAt.toISOString(),
      };
    });
  };

  export const create = async (data: Omit<Assignment, "id" | "createdAt">) => {
    const { default: prisma } = require("../../../providers/database/database.provider");

    if (data.evaluatorId === data.evaluateeId) {
      throw new Error("ไม่สามารถเลือกผู้ประเมินและผู้รับการประเมินเป็นคนเดียวกันได้");
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        evaluationId: data.evaluationId,
        evaluatorId: data.evaluatorId,
        evaluateeId: data.evaluateeId,
      }
    });

    if (existing) {
      throw new Error("คู่ประเมินนี้มีอยู่แล้วในระบบ");
    }

    const newAssignment = await AssignmentRepository.create(data);
    return {
      ...newAssignment,
      createdAt: newAssignment.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<Assignment, "id" | "createdAt">>
  ) => {
    const updatedAssignment = await AssignmentRepository.update(id, data);
    return {
      ...updatedAssignment,
      createdAt: updatedAssignment.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await AssignmentRepository.deleteById(id);
  };

  export const calculateScore = async (assignmentId: string) => {
    // We need to fetch the assignment, its evaluation, topics, indicators, and results.
    // To avoid circular dependencies, we'll use Prisma directly here for this complex query.
    const { default: prisma } = require("../../../providers/database/database.provider");

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        evaluation: {
          include: { topics: { include: { indicators: true } } }
        },
        indicatorResults: true,
        evaluator: true,
        evaluatee: true
      }
    });

    if (!assignment) return null;

    let totalScore = 0;
    let maxPossibleScore = 0;

    const resultsMap = new Map();
    for (const result of assignment.indicatorResults) {
      resultsMap.set(result.indicatorId, { score: result.score, evidenceUrl: result.evidenceUrl });
    }

    const topics = assignment.evaluation.topics.map((topic: any) => {
      const indicators = (topic.indicators || []).map((ind: any) => {
        const result = resultsMap.get(ind.id);
        const scoreGiven = result ? result.score : 0;
        let scoreAdjusted = 0;

        maxPossibleScore += ind.weight;

        const type = (ind.IndicatorType || ind.type || "").toUpperCase();
        if (type === "SCALE_1_4" || type === "SCALE 1-4") {
          scoreAdjusted = (scoreGiven / 4) * ind.weight;
        } else if (type === "YES_NO" || type === "YES/NO") {
          scoreAdjusted = scoreGiven > 0 ? ind.weight : 0;
        }

        totalScore += scoreAdjusted;

        return {
          id: ind.id,
          name: ind.name,
          type: type === "SCALE 1-4" || type === "SCALE_1_4" ? "SCALE_1_4" : type === "YES/NO" || type === "YES_NO" ? "YES_NO" : type,
          weight: ind.weight,
          scoreGiven,
          scoreAdjusted: Number(scoreAdjusted.toFixed(2)),
          requiredEvidences: !!ind.requiredEvidences,
          evidenceUrl: result?.evidenceUrl || null
        };
      });

      return {
        id: topic.id,
        name: topic.name,
        indicators
      };
    });

    return {
      id: assignmentId,
      evaluatorName: (assignment.evaluator as any)?.name || "",
      evaluateeName: (assignment.evaluatee as any)?.name || "",
      totalScorePercentage: maxPossibleScore > 0 ? Number(((totalScore / maxPossibleScore) * 100).toFixed(2)) : 0,
      topics
    };
  };

  export const getForm = async (assignmentId: string) => {
    const { default: prisma } = require("../../../providers/database/database.provider");
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        evaluation: {
          include: { topics: { include: { indicators: true } } }
        },
        indicatorResults: true,
        evaluator: true,
        evaluatee: true
      }
    });

    if (!assignment) return null;

    const resultsMap = new Map();
    assignment.indicatorResults.forEach((r: any) => resultsMap.set(r.indicatorId, { score: r.score, evidenceUrl: r.evidenceUrl }));

    let totalScore = 0;
    let maxPossibleScore = 0;

    const topics = assignment.evaluation.topics.map((t: any) => ({
      id: t.id,
      name: t.name,
      indicators: t.indicators.map((i: any) => {
        const result = resultsMap.get(i.id);
        const scoreGiven = result ? result.score : null;
        let scoreAdjusted = 0;

        maxPossibleScore += i.weight;

        const type = (i.IndicatorType || i.type || "").toUpperCase();
        if (scoreGiven !== null) {
          if (type === "SCALE_1_4" || type === "SCALE 1-4") {
            scoreAdjusted = (scoreGiven / 4) * i.weight;
          } else if (type === "YES_NO" || type === "YES/NO") {
            scoreAdjusted = scoreGiven > 0 ? i.weight : 0;
          }
        }

        totalScore += scoreAdjusted;

        return {
          id: i.id,
          name: i.name,
          type: type === "SCALE 1-4" || type === "SCALE_1_4" ? "SCALE_1_4" : type === "YES/NO" || type === "YES_NO" ? "YES_NO" : type,
          weight: i.weight,
          requiresEvidence: !!i.requiredEvidences,
          evidenceUrl: result?.evidenceUrl || null,
          scoreGiven,
          scoreAdjusted: Number(scoreAdjusted.toFixed(2))
        };
      })
    }));

    return {
      evaluationName: assignment.evaluation.name,
      evaluateeName: assignment.evaluatee.name,
      evaluatorName: assignment.evaluator.name,
      totalScorePercentage: maxPossibleScore > 0 ? Number(((totalScore / maxPossibleScore) * 100).toFixed(2)) : 0,
      isCompleted: assignment.indicatorResults.length >= assignment.evaluation.topics.reduce((acc: number, topic: any) => acc + topic.indicators.length, 0),
      topics
    };
  };

  export const submitForm = async (assignmentId: string, scores: { indicatorId: string, scoreGiven: number }[]) => {
    const { default: prisma } = require("../../../providers/database/database.provider");
    
    // Upsert indicator results
    for (const item of scores) {
      await prisma.indicatorResult.upsert({
        where: {
          assignmentId_indicatorId: {
            assignmentId,
            indicatorId: item.indicatorId
          }
        },
        update: { score: item.scoreGiven },
        create: {
          assignmentId,
          indicatorId: item.indicatorId,
          score: item.scoreGiven
        }
      });
    }
    return { success: true };
  };

  export const uploadEvidence = async (assignmentId: string, indicatorId: string, fileUrl: string) => {
    const { default: prisma } = require("../../../providers/database/database.provider");
    await prisma.indicatorResult.upsert({
      where: {
        assignmentId_indicatorId: {
          assignmentId,
          indicatorId
        }
      },
      update: { evidenceUrl: fileUrl },
      create: {
        assignmentId,
        indicatorId,
        evidenceUrl: fileUrl,
        score: 0 // initial score
      }
    });
    return { success: true };
  };
}
