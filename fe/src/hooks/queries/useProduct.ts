import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "@/services/product";
import {
  CreateProductRequest,
  GetProductsParams,
  UpdateProductRequest,
} from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.product.list({ category: params.category }),
    queryFn: () => getProducts(params),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.product.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product.all() });
    },
  });
};

export const useUpdateProduct = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product.all() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.product.detail(id) });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.product.all(), "list"],
      });
    },
  });
};
