import {Request, Response} from "express";
import { UploadRequest } from "../models/interfaces/upload-request";
import { Image } from "../models/objs/image";
import { saveImage } from "../services/sql";

export function createImage(req: Request & UploadRequest, res: Response) {
  console.log(`Creating new image for file [${req.file.bucket}/${req.file.path}]`)
  const { file } = req;
  if (
    !file.originalname ||
    !file.bucket ||
    !file.path
  ){
    const error = new Error("Cloud Storage keys not found on file");
    throw(error);
  }
  
  const item = new Image(file);
  item.tags = [1,2,3];
  item.details = {
    metadata: {
        height: 0,
        width: 0,
    },
    uploadInfo: {
        originalName: file.originalname,
        bucket: file.bucket,
        fileName: file.path,
    }
  };

  return saveImage(item)
  .then(value => {
    return res.send(value);
  });
}
