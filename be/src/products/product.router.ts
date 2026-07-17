import { Router } from "express";
import {
  getProductById,
  getProductImageUploadUrl,
  getProducts,
  patchProduct,
  postProduct,
  removeProduct,
} from "./product.controller";

const router = Router();

router.get("/presigned-upload-url", getProductImageUploadUrl);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", postProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", removeProduct);

export default router;
