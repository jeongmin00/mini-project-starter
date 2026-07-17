import { Request, Response } from "express";
import { generatePresignedUploadUrl } from "./upload.service";

export const getPresignedUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "fileName과 fileType이 필요합니다." });
    }

    const { uploadUrl, key } = await generatePresignedUploadUrl(
      fileName as string,
      fileType as string,
    );

    res.json({ uploadUrl, key });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
