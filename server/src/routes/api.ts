import { Router, Request, Response } from "express";

const apiRouter = Router();

apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default apiRouter;
