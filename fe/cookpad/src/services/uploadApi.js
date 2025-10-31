import axiosInstance from "./axiosClient";

/**
 * Upload a single file (image/media).
 * Note: do NOT manually set Content-Type header here so the browser can
 * include the multipart boundary automatically.
 * @param {File} file
 * @param {Object} [meta] optional metadata to send with the file
 * @returns {Promise<AxiosResponse>}
 */
export const uploadMedia = (file, meta = {}) => {
  const form = new FormData();
  form.append("file", file);
  Object.entries(meta).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });

  // ✅ Thêm config để ghi đè 'Content-Type'
  return axiosInstance.post("/media", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Upload multiple files.
 * @param {File[]} files
 * @param {Object} [meta]
 * @returns {Promise<AxiosResponse>}
 */
export const uploadMultiple = (files = [], meta = {}) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  Object.entries(meta).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });
  return axiosInstance.post("/media/batch", form);
};

/**
 * Upload image(s) for a specific recipe
 * Backend route may be: POST /recipes/:id/images
 * @param {string} recipeId
 * @param {File|File[]} fileOrFiles
 * @returns {Promise<AxiosResponse>}
 */
export const uploadRecipeImages = (recipeId, fileOrFiles) => {
  const form = new FormData();
  if (Array.isArray(fileOrFiles)) {
    fileOrFiles.forEach((f) => form.append("images", f));
  } else {
    form.append("image", fileOrFiles);
  }
  return axiosInstance.post(`/recipes/${recipeId}/images`, form);
};

/**
 * Get media list (supports pagination / filters via params)
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const getMediaList = (params = {}) => {
  return axiosInstance.get("/media", { params });
};

/**
 * Get single media item
 * @param {string} mediaId
 * @returns {Promise<AxiosResponse>}
 */
export const getMediaById = (mediaId) => {
  return axiosInstance.get(`/media/${mediaId}`);
};

/**
 * Delete media by id
 * @param {string} mediaId
 * @returns {Promise<AxiosResponse>}
 */
export const deleteMedia = (mediaId) => {
  return axiosInstance.delete(`/media/${mediaId}`);
};

/**
 * (Optional) Request a signed upload URL from backend (S3 style)
 * @param {Object} payload { filename, contentType, ... }
 * @returns {Promise<AxiosResponse>}
 */
export const getSignedUploadUrl = (payload) => {
  return axiosInstance.post("/media/signed-url", payload);
};

export default {
  uploadMedia,
  uploadMultiple,
  uploadRecipeImages,
  getMediaList,
  getMediaById,
  deleteMedia,
  getSignedUploadUrl,
};
