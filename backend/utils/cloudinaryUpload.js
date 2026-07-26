import { cloudinary, isConfigured } from "../config/cloudinary.js";
import ApiError from "./ApiError.js";

const PRODUCT_FOLDER = "melted-modulus/products";

const assertCloudinaryConfigured = () => {
  if (!isConfigured) {
    throw new ApiError(
      500,
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
};

export const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com");

const getPublicIdFromUrl = (url) => {
  if (!isCloudinaryUrl(url)) return null;

  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return null;

  const pathAfterUpload = url.slice(uploadIndex + "/upload/".length);
  const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
  const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, "");

  return withoutExtension || null;
};

export const uploadProductImageToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    assertCloudinaryConfigured();

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_FOLDER,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, `Image upload failed: ${error.message}`));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });

export const uploadProductImagesToCloudinary = async (files = []) => {
  if (!files?.length) return [];
  return Promise.all(files.map(uploadProductImageToCloudinary));
};

export const deleteCloudinaryImages = async (urls = []) => {
  if (!isConfigured) return;

  const publicIds = urls.map(getPublicIdFromUrl).filter(Boolean);
  if (publicIds.length === 0) return;

  await Promise.allSettled(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
  );
};

export const getRemovedCloudinaryImages = (previousImages = [], nextImages = []) => {
  const nextSet = new Set(nextImages);
  return previousImages.filter(
    (url) => isCloudinaryUrl(url) && !nextSet.has(url),
  );
};
