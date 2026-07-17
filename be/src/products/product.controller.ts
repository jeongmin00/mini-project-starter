import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  generateProductImageUploadUrl,
  updateProduct,
} from "./product.service";

export const getProducts = async (req: Request, res: Response) => {
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const category = req.query.category as string | undefined;

  const products = await findAllProducts(cursor, limit, category);
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await findProductById(id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const postProduct = async (req: Request, res: Response) => {
  try {
    const { userId, ...rest } = req.body;
    const product = await createProduct({
      ...rest,
      user: { connect: { id: userId } },
    });
    res.status(201).json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const patchProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const product = await updateProduct(id, req.body);
    res.json(product);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getProductImageUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "fileName과 fileType이 필요합니다." });
    }
    const { uploadUrl, key } = await generateProductImageUploadUrl(
      fileName as string,
      fileType as string,
    );
    res.json({ uploadUrl, key });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
