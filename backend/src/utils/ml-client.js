import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

export const mlClient = {
  /**
   * Send image to ML service for prediction
   * @param {string} imagePath - Local path to image file
   * @returns {Promise<Object>} - ML prediction result
   */
  async predict(imagePath) {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 30000, // 30 second timeout for image processing
      }
    );

    return response.data;
  },

  /**
   * Check ML service health
   * @returns {Promise<Object>} - Health status
   */
  async health() {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, {
      timeout: 5000,
    });
    return response.data;
  },

  /**
   * Check if ML service is available
   * @returns {Promise<boolean>} - True if available
   */
  async isAvailable() {
    try {
      const status = await this.health();
      return status.status === "ready";
    } catch (error) {
      console.error("[ML Client] Service unavailable:", error.message);
      return false;
    }
  },
};

export default mlClient;
