import { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  findReviewsByProductId,
  updateReview,
} from "./review.service";

export const getReviews = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  const reviews = await findReviewsByProductId(productId);
  res.json(reviews);
};

export const postReview = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const { userId, ...rest } = req.body;
    const review = await createReview(productId, {
      ...rest,
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    });
    res.status(201).json(review);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const patchReview = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const id = Number(req.params.id);
    const review = await updateReview(id, productId, req.body);
    res.json(review);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const removeReview = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const id = Number(req.params.id);
    await deleteReview(id, productId);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
