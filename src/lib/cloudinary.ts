import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Função utilitária para fazer upload de um Buffer de imagem para o Cloudinary
 * @param fileBuffer Buffer da imagem
 * @param folder Pasta destino no Cloudinary
 * @returns Promise com a secure_url retornada pelo Cloudinary
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'imoveis-ingrid-bossa'
): Promise<string> {
  // Se Cloudinary não estiver configurado nas variáveis de ambiente, retorna Data URL Base64 para total resiliência
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  if (!cloudName || !apiKey || cloudName === 'demo' || cloudName === 'seu_cloud_name') {
    return `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }, // Otimização automática de peso
          { fetch_format: 'auto' }, // Formato moderno (Webp/Avif)
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Falha no upload para o Cloudinary'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}
