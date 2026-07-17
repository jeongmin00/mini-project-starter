import { Router } from "express";
import {
  getReviews,
  patchReview,
  postReview,
  removeReview,
} from "./review.controller";

const router = Router({ mergeParams: true });

router.get("/", getReviews);
router.post("/", postReview);
router.patch("/:id", patchReview);
router.delete("/:id", removeReview);

export default router;
