export type Review = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  productId: number;
  userId: number;
};

export type CreateReviewRequest = {
  content: string;
  rating: number;
  userId: number;
};

export type UpdateReviewRequest = Partial<CreateReviewRequest>;
