export const QUERY_KEYS = {
  sample: {
    all: () => ["sample"] as const,
    list: () => [...QUERY_KEYS.sample.all(), "list"] as const,
    detail: (id: number) => [...QUERY_KEYS.sample.all(), "detail", id] as const,
  },
  auth: {
    all: () => ["auth"] as const,
    me: () => [...QUERY_KEYS.auth.all(), "me"] as const,
  },
  product: {
    all: () => ["product"] as const,
    list: (params?: { category?: string }) =>
      [...QUERY_KEYS.product.all(), "list", params ?? {}] as const,
    detail: (id: number) =>
      [...QUERY_KEYS.product.all(), "detail", id] as const,
  },
  review: {
    all: () => ["review"] as const,
    list: (productId: number) =>
      [...QUERY_KEYS.review.all(), "list", productId] as const,
  },
};
