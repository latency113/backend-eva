import { TopicService } from "../../services/topic/topic.service";
import { TopicSchema } from "../../services/topic/topic.schema";
import { t, Elysia } from "elysia";

export namespace TopicController {
  export const topicController = new Elysia({ prefix: "/topics" })
    .get(
      "/",
      async () => {
        return await TopicService.findAll();
      },
      {
        response: {
          200: t.Any(),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Topic"],
      },
    )
    .get(
      "/:id",
      async (context) => {
        const { params, set } = context as any;
        try {
          const topic = await TopicService.findById(params.id);
          if (!topic) {
            set.status = 404;
            return { message: "Topic not found" };
          }
          return topic;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        response: {
          200: t.Any(),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Topic"],
      },
    )
    .get(
      "/evaluation/:evaluationId",
      async (context) => {
        const { params, set } = context as any;
        try {
          return await TopicService.findByEvaluationId(params.evaluationId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          evaluationId: t.String(),
        }),
        response: {
          200: t.Any(),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Topic"],
      }
    )
    .post(
      "/",
      async (context) => {
        const { body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can create topics" };
        }
        try {
          const newTopic = await TopicService.create(body);
          set.status = 201;
          return newTopic;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(TopicSchema, ["id", "createdAt"]),
        response: {
          201: TopicSchema,
          403: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Topic"],
      },
    )
    .put(
      "/:id",
      async (context) => {
        const { params, body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update topics" };
        }
        try {
          const updatedTopic = await TopicService.update(params.id, body);
          if (!updatedTopic) {
            set.status = 404;
            return { message: "Topic not found" };
          }
          return updatedTopic;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(TopicSchema, ["id", "createdAt", "evaluationId", "createdBy"]),
        response: {
          200: TopicSchema,
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Topic"],
      },
    )
    .delete(
      "/:id",
      async (context) => {
        const { params, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can delete topics" };
        }
        try {
          await TopicService.deleteById(params.id);
          return { message: "Topic deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "Topic not found" };
          }
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        response: {
          200: t.Object({ message: t.String() }),
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Topic"],
      },
    );
}
