import api from "./api.js";

/**
 * Disease service - handles diagnosis and disease-related API calls
 */
export const diseaseService = {
  /**
   * Upload image and get disease diagnosis
   * @param {File} file - Image file to upload
   * @param {string} plantId - Associated plant ID
   * @returns {Promise<Object>} - Diagnosis result
   */
  async diagnose(file, plantId) {
    const formData = new FormData();
    formData.append("image", file);
    if (plantId) {
      formData.append("plantId", plantId);
    }

    const response = await api.post("/diagnosis/diagnose", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Get all diagnoses for current user
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of diagnoses
   */
  async getDiagnoses(params = {}) {
    const { limit = 20, skip = 0, plantId } = params;
    const response = await api.get("/diagnosis/diagnoses", { params });

    return response.data;
  },

  /**
   * Get single diagnosis by ID
   * @param {string} id - Diagnosis ID
   * @returns {Promise<Object>} - Diagnosis details
   */
  async getDiagnosis(id) {
    const response = await api.get(`/diagnosis/diagnoses/${id}`);

    return response.data;
  },

  /**
   * Delete a diagnosis
   * @param {string} id - Diagnosis ID
   * @returns {Promise<Object>} - Delete result
   */
  async deleteDiagnosis(id) {
    const response = await api.delete(`/diagnosis/diagnoses/${id}`);

    return response.data;
  },

  /**
   * Get diagnosis statistics
   * @returns {Promise<Object>} - Statistics
   */
  async getDiagnosisStats() {
    const response = await api.get("/diagnosis/stats");

    return response.data;
  },
};

export default diseaseService;
