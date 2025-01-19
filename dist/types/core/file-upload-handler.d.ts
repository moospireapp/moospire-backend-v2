declare class FileUploadHandler {
    /**
     * Resizes an image by compressing it and returning the compressed file path.
     * @param filepath - The file path of the image to be compressed.
     * @param next - The next function to handle errors or pass execution.
     * @returns The path to the compressed image file.
     */
    resizeImage(filepath: any, next: Function): Promise<string | boolean>;
    /**
     * Deletes all files in a specified folder.
     * @param folderPath - The folder path where the uploaded images are stored.
     */
    removeUploadedImageServerFile(folderPath: string): Promise<void>;
    /**
     * Removes an uploaded image from Cloudinary by its ID.
     * @param imageId - The ID of the image to remove from Cloudinary.
     */
    removeUploadedImageCloudFile(imageId: string): Promise<void>;
    /**
     * Uploads a file to Cloudinary.
     * @param file - The file to upload.
     * @param next - The next function to handle errors or pass execution.
     * @returns The Cloudinary upload result or `false` in case of an error.
     */
    fileUpload(file: any, next: Function): Promise<any | boolean>;
}
declare const _default: FileUploadHandler;
export default _default;
