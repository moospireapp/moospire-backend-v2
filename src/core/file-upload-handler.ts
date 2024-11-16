import path from "path";
import sharp from "sharp";
import fsExtra from "fs-extra";
import { apiStatus } from "@/core";
import { env, appLogger, cloudinary } from "@/config";

class FileUploadHandler {
  // private imageDimension = {
  //   width: 700,
  //   height: 650,
  // };

  /**
   * Resizes an image by compressing it and returning the compressed file path.
   * @param filepath - The file path of the image to be compressed.
   * @param next - The next function to handle errors or pass execution.
   * @returns The path to the compressed image file.
   */
  async resizeImage(filepath: any, next: Function): Promise<string | boolean> {
    const imagePath = path.join(__dirname, "../templates/tmp/upload.jpg");
    const compressedPath = path.join(
      __dirname,
      "../templates/tmp/compress.jpg"
    );

    try {
      await filepath.mv(imagePath);
    } catch (e) {
      next(apiStatus.badRequest("Unable to process image"));
      return false;
    }

    try {
      await sharp(imagePath)
        // .resize(this.imageDimension)
        .jpeg({ quality: 80, chromaSubsampling: "4:4:4" })
        .toFile(compressedPath);

      return compressedPath;
    } catch (error) {
      next(apiStatus.badRequest("Unable to compress image"));
      return false;
    }
  }

  /**
   * Deletes all files in a specified folder.
   * @param folderPath - The folder path where the uploaded images are stored.
   */
  async removeUploadedImageServerFile(folderPath: string): Promise<void> {
    try {
      await fsExtra.emptyDir(folderPath);
    } catch (err) {
      appLogger.error(err);
    }
  }

  /**
   * Removes an uploaded image from Cloudinary by its ID.
   * @param imageId - The ID of the image to remove from Cloudinary.
   */
  async removeUploadedImageCloudFile(imageId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (err) {
      appLogger.error(err);
    }
  }

  /**
   * Uploads a file to Cloudinary.
   * @param file - The file to upload.
   * @param next - The next function to handle errors or pass execution.
   * @returns The Cloudinary upload result or `false` in case of an error.
   */
  async fileUpload(file: any, next: Function): Promise<any | boolean> {
    try {
      // let compressedImage = await this.resizeImage(file, next);

      const result = await cloudinary.uploader.upload(file, {
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
      });

      await this.removeUploadedImageServerFile(
        path.join(__dirname, `../templates/tmp`)
      );

      return result;
    } catch (error) {
      appLogger.error(error);
      next(apiStatus.badRequest("Unable to upload image"));
      return false;
    }
  }
}

export default new FileUploadHandler();
