import { Router } from "express";
import { getPresignedUploadUrl } from "./upload.controller";

const router = Router();

router.get("/presigned-upload-url", getPresignedUploadUrl);

export default router;
