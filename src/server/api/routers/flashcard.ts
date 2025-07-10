import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import OpenAI from "openai";
import { env } from "~/env";
import { cards, flashcards, flashcardSubjects } from "~/server/db/schema";
import { count, eq } from "drizzle-orm";

export type QA = {
  question: string;
  answer: string;
};

export const openai = new OpenAI({
  apiKey: env.OPENAI_SECRET,
});

export const flashCardRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        count: z
          .number()
          .gte(1, "Count must be greater than 1.")
          .lte(20, "Count must not exceed 20."),
        content: z
          .string()
          .max(20000, "Content must not exceed 20,000 characters.")
          .min(100, "Content must be at least 100 characters long."),
        title: z
          .string()
          .min(3, "Title must be at least 3 characters long.")
          .max(24, "Title must not exceed 24 characters."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { db } = ctx;
        const responses = await openai.responses.create({
          prompt: {
            id: "pmpt_686e5bf2e3d08197bdeeb97eaf85c4330927eecce6b3ef7a",
            version: "5",
            variables: {
              count: input.count.toString(),
              notes: input.content,
            },
          },
        });

        const content = JSON.parse(responses.output_text) as {
          subjects: string[];
          flashcards: QA[];
        };

        const user = ctx.session?.user.id ?? null;

        //   TODO: fix the data
        const [result] = (await db
          .insert(flashcards)
          .values({ title: input.title, createdBy: user })
          .$returningId()) as { id: number }[];

        const cardsMapping = content.flashcards.map((el) => ({
          flashcardId: result!.id,
          question: el.question,
          answer: el.answer,
        })) as unknown as (typeof cards.$inferInsert)[];

        const flashcardSubjectsMapping = content.subjects.map((el) => ({
          flashcardId: result!.id,
          subject: el,
        })) as unknown as typeof flashcardSubjects.$inferInsert;

        await db.insert(flashcardSubjects).values(flashcardSubjectsMapping);
        await db.insert(cards).values(cardsMapping);

        return result!.id;
      } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
      }
    }),
  getFlashCard: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const result = await db.query.flashcards.findFirst({
        where: (flashcard, { eq }) => eq(flashcard.id, input),
        with: {
          cards: true,
          subjects: true,
        },
      });

      return result;
    }),
  getFlashCards: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const offset = (input.page - 1) * input.pageSize;
      const data = await db.query.flashcards.findMany({
        orderBy: (flashcard, { desc }) => desc(flashcard.id),
        limit: input.pageSize,
        offset,
        with: {
          cards: true,
          subjects: true,
        },
      });

      const [row] = (await db.select({ count: count() }).from(flashcards)) as {
        count: number;
      }[];

      const total = row ? row.count : 0;
      // TODO: get some efficient solution for this

      return {
        data,
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),
  getMyFlashCards: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const offset = (input.page - 1) * input.pageSize;
      const data = await db.query.flashcards.findMany({
        where: (flashcard, { eq }) => eq(flashcard.createdBy, session.user.id),
        orderBy: (flashcard, { desc }) => desc(flashcard.id),
        limit: input.pageSize,
        offset,
        with: {
          cards: true,
          subjects: true,
        },
      });

      const [row] = (await db
        .select({ count: count() })
        .from(flashcards)
        .where(eq(flashcards.createdBy, session.user.id))) as {
        count: number;
      }[];

      const total = row ? row.count : 0;

      return {
        data,
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),
});
