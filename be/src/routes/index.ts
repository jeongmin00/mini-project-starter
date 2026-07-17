import { Router } from "express";
import authRouter from "../auth/auth.router";
import productRouter from "../products/product.router";
import reviewRouter from "../reviews/review.router";
import sampleRouter from "../sample/sample.router";
import uploadRouter from "../upload/upload.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/samples", sampleRouter);
router.use("/products", productRouter);
router.use("/products/:productId/reviews", reviewRouter);
router.use("/upload", uploadRouter);

export default router;
