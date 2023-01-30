import { router } from "../trpc";
import { scoresRouter } from "./scores";

export const appRouter = router({
  scores: scoresRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
