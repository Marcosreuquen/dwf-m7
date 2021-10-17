import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImgToCloudinary(img: string): Promise<string> {
  const dataURL = await cloudinary.uploader.upload(img, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });
  return dataURL.secure_url;
}

export { cloudinary, uploadImgToCloudinary };
