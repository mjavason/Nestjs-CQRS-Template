import { cloudinaryInstance } from 'src/common/configs/cloudinary.config';

export const uploadToCloudinary = async (
  path: string,
  folder: string = 'Uploads',
): Promise<any> => {
  try {
    const result = await cloudinaryInstance.uploader.upload(path, {
      folder,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadRawFileToCloudinary = async (
  filePath: string,
  folder: string = 'Uploads',
) => {
  try {
    const uploadResult = await cloudinaryInstance.uploader.upload(filePath, {
      resource_type: 'raw',
      folder,
    });
    return uploadResult;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
  }
};

export const deleteFromCloudinary = async (public_id: string): Promise<any> => {
  try {
    const result = await cloudinaryInstance.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const fetchCloudinaryFileDetails = async (
  public_id: string,
): Promise<any> => {
  try {
    const result = await cloudinaryInstance.api.resource(public_id);
    return result;
  } catch (error) {
    console.error('Error fetching file details from Cloudinary:', error);
    throw new Error('Failed to fetch file details from Cloudinary');
  }
};

export const listFilesInCloudinaryFolder = async (
  folder: string,
): Promise<any> => {
  try {
    const result = await cloudinaryInstance.api.resources({
      type: 'upload',
      prefix: folder,
      resource_type: 'raw',
    });
    return result;
  } catch (error) {
    console.error('Error listing files from Cloudinary folder:', error);
    throw new Error('Failed to list files from Cloudinary folder');
  }
};

export const renameCloudinaryFile = async (
  public_id: string,
  new_public_id: string,
): Promise<any> => {
  try {
    const result = await cloudinaryInstance.uploader.rename(
      public_id,
      new_public_id,
    );
    return result;
  } catch (error) {
    console.error('Error renaming file in Cloudinary:', error);
    throw new Error('Failed to rename file in Cloudinary');
  }
};

export const bulkDeleteFromCloudinary = async (
  public_ids: string[],
): Promise<any> => {
  try {
    const result = await cloudinaryInstance.api.delete_resources(public_ids);
    return result;
  } catch (error) {
    console.error('Error bulk deleting from Cloudinary:', error);
    throw new Error('Failed to bulk delete files from Cloudinary');
  }
};

export const deleteCloudinaryFolder = async (folder: string): Promise<any> => {
  try {
    const result = await cloudinaryInstance.api.delete_folder(folder);
    return result;
  } catch (error) {
    console.error('Error deleting Cloudinary folder:', error);
    throw new Error('Failed to delete Cloudinary folder');
  }
};

export async function fetchLatestUploadedFileInFolder(
  folder: string = 'Uploads',
) {
  try {
    const response = await cloudinaryInstance.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
      resource_type: 'raw',
    });

    if (response.resources.length > 0) {
      const sortedFiles = response.resources.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      const latestFile = sortedFiles[0];
      return latestFile;
    } else {
      console.log('No files found in the specified folder.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching files from folder:', error);
    return null;
  }
}

// export const deleteOldFilesInFolder = async (folder: string, ageInDays: number) => {
//   try {
//     // Fetch all resources in the folder
//     const response = await cloudinaryInstance.api.resources({
//       type: 'upload',
//       prefix: folder,
//       max_results: 500, // Fetch up to 500 files
//       resource_type: 'raw', // Fetch raw files
//     });

//     if (response.resources.length === 0) {
//       console.log('No files found in the specified folder.');
//       return;
//     }

//     const threeDaysAgo = dayjs().subtract(ageInDays, 'days').toDate();

//     const oldFiles = response.resources.filter((file: any) => {
//       const createdAt = new Date(file.created_at);
//       return createdAt < threeDaysAgo; // Check if file is older than 3 days
//     });

//     if (oldFiles.length === 0) {
//       console.log('No files older than 3 days found.');
//       return;
//     }

//     // Delete all old files
//     for (const file of oldFiles) {
//       await cloudinaryInstance.api.delete_resources([file.public_id]);
//       console.log(`Deleted file: ${file.public_id}`);
//     }

//     console.log(
//       `Successfully deleted ${oldFiles.length} files older than 3 days.`
//     );
//   } catch (error) {
//     console.error('Error deleting old files:', error);
//   }
// };
