import { accounts, sessions, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  deleteGoogleAccount: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { db, session } = ctx;

      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, session.user.id),
            eq(accounts.provider, "google"),
          ),
        );
      await db.delete(sessions).where(eq(sessions.userId, session.user.id));
      await db.delete(users).where(eq(users.id, session.user.id));

      return true;
    } catch {
      return false;
    }
  }),
});
