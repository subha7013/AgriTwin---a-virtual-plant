import api from "./api.js";

/**
 * Sensor service - handles telemetry and sensor-related API calls
 */
export const sensorService = {
  /**
   * Submit sensor/telemetry data
   * @param {Object} data - Sensor data
   * @returns {Promise<Object>} - Created telemetry record
   */
  async submitSensorData(data) {
    const response = await api.post("/telemetry", data);

    return response.data;
  },

  /**
   * Get sensor history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of telemetry records
   */
  async getSensorHistory(params = {}) {
    const response = await api.get("/telemetry", { params });

    return response.data;
  },

  /**
   * Get latest sensor reading for a plant
   * @param {string} plantId - Plant ID
   * @returns {Promise<Object>} - Latest telemetry
   */
  async getLatestSensorData(plantId) {
    const response = await api.get("/telemetry/latest", {
      params: { plantId },
    });

    return response.data;
  },

  /**
   * Get sensor statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Statistics
   */
  async getSensorStats(params = {}) {
    const response = await api.get("/telemetry/stats", { params });

    return response.data;
  },

  /**
   * Get recent alerts from sensors
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - List of alerts
   */
  async getSensorAlerts(params = {}) {
    const response = await api.get("/telemetry/alerts", { params });

    return response.data;
  },

  /**
   * Get plant sensor summary
   * @param {string} plantId - Plant ID
   * @returns {Promise<Object>} - Summary
   */
  async getPlantSummary(plantId) {
    const response = await api.get("/telemetry/summary", {
      params: { plantId },
    });

    return response.data;
  },
};

export default sensorService;
