import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Disease } from "../../models/Disease.js";
import { Plant } from "../../models/Plant.js";
import { ApiError } from "../../utils/ApiError.js";
import { logger } from "../../config/logger.js";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, "../../../..");

// Determine Python executable (Check standard Windows Python313 or PATH)
function getPythonExecutable() {
  const candidates = [
    process.env.PYTHON_PATH,
    "C:\\Python313\\python.exe",
    "python3",
    "python",
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) {
      return c;
    }
  }
  return "python";
}

const CLASS_TO_SLUG = {
  "Tomato___Bacterial_spot": "bacterial-spot",
  "Tomato___Early_blight": "early-blight",
  "Tomato___healthy": "healthy",
  "Tomato___Late_blight": "late-blight",
  "Tomato___Leaf_Mold": "leaf-mold",
  "Tomato___Septoria_leaf_spot": "septoria-leaf-spot",
  "Tomato___Spider_mites Two-spotted_spider_mite": "spider-mites",
  "Tomato___Target_Spot": "target-spot",
  "Tomato___Tomato_mosaic_virus": "tomato-mosaic-virus",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "yellow-leaf-curl-virus",
};

const DEFAULT_PROFILES = {
  "healthy": {
    displayName: "Healthy Tomato Plant",
    category: "Healthy Plant",
    description: "The foliage displays normal chlorophyll pigmentation with no symptoms of pathogenic infection or pest damage.",
    symptoms: ["Vibrant green foliage", "Uniform leaf morphology", "Active healthy transpiration"],
    causes: ["Optimal microclimate", "Balanced nutrition (N-P-K)", "Proper irrigation"],
    prevention: ["Continue standard fertilization and moisture scheduling", "Maintain routine inspection"],
  },
  "early-blight": {
    displayName: "Early Blight",
    category: "Fungal Disease (Alternaria solani)",
    description: "Alternaria solani creates characteristic concentric 'bullseye' target spots on older foliage, leading to premature defoliation.",
    symptoms: ["Brown circular spots with concentric target rings", "Yellowing chlorotic halo around lesions", "Lower canopy leaf drop"],
    causes: ["Alternaria solani fungus", "Warm temperatures (24-29°C)", "Prolonged leaf wetness"],
    prevention: ["Water at root zone using drip irrigation", "Prune lower foliage touching soil", "Apply copper or chlorothalonil fungicide"],
  },
  "late-blight": {
    displayName: "Late Blight",
    category: "Oomycete Pathogen (Phytophthora infestans)",
    description: "Aggressive water mold disease capable of devastating entire tomato fields within days under cool, humid conditions.",
    symptoms: ["Water-soaked dark lesions", "White fuzzy mycelium on leaf undersides", "Rapid collapse of petiole and stem"],
    causes: ["Phytophthora infestans", "Cool humid weather (15-22°C, >90% RH)", "Extended dew periods"],
    prevention: ["Eliminate volunteer cull piles", "Increase greenhouse airflow and spacing", "Apply preventative bio-fungicides"],
  },
  "bacterial-spot": {
    displayName: "Bacterial Spot",
    category: "Bacterial Disease (Xanthomonas)",
    description: "Bacterial pathogen causing small angular dark water-soaked spots with yellow halos across leaves and fruit calyx.",
    symptoms: ["Small angular greasy dark spots", "Yellowing margins around necrotic lesions", "Sunken scab-like spots on green fruit"],
    causes: ["Xanthomonas spp.", "Warm splashing rain or overhead irrigation", "Infected seed stock"],
    prevention: ["Avoid overhead sprinklers", "Sterilize pruning shears between rows", "Apply copper bactericide sprays"],
  },
  "leaf-mold": {
    displayName: "Leaf Mold",
    category: "Fungal Disease (Passalora fulva)",
    description: "Common greenhouse problem thriving in stagnant, highly humid air without adequate ventilation.",
    symptoms: ["Pale yellow diffuse spots on upper leaf surfaces", "Olive-green to brown velvety sporulation underneath", "Premature leaf drop starting from lower branches"],
    causes: ["Passalora fulva fungus", "Relative humidity exceeding 85%", "Poor air circulation"],
    prevention: ["Keep relative humidity below 80%", "Increase ventilation fan runtimes", "Use resistant greenhouse cultivars"],
  },
  "septoria-leaf-spot": {
    displayName: "Septoria Leaf Spot",
    category: "Fungal Disease (Septoria lycopersici)",
    description: "Severe foliar disease marked by numerous small circular spots with gray centers and black fruiting bodies.",
    symptoms: ["Numerous small circular lesions (1-3mm)", "Gray centers with distinct dark brown borders", "Tiny black pycnidia visible inside spots"],
    causes: ["Septoria lycopersici", "Prolonged wet foliage", "Soil splash during heavy rain"],
    prevention: ["Apply straw or plastic mulch beneath plants", "Remove infected lower leaves", "Rotate crops on 3-year cycle"],
  },
  "spider-mites": {
    displayName: "Two-Spotted Spider Mite",
    category: "Arachnid Pest (Tetranychus urticae)",
    description: "Microscopic sap-feeding pests that multiply explosively in dry, hot conditions, causing leaf stippling and webbing.",
    symptoms: ["Fine white or yellow speckling on upper leaf surface", "Fine silky webbing under leaves and growing tips", "Bronzing and drying of foliage"],
    causes: ["Hot dry weather (>30°C, <40% RH)", "Dusty conditions", "Absence of natural predators"],
    prevention: ["Mist foliage lightly to increase humidity", "Release Phytoseiulus persimilis predatory mites", "Apply insecticidal soap or neem oil"],
  },
  "target-spot": {
    displayName: "Target Spot",
    category: "Fungal Disease (Corynespora cassiicola)",
    description: "Causes pinpoint brown lesions that expand with concentric zoning, affecting leaves, stems, and blossoms.",
    symptoms: ["Brown circular lesions with concentric target rings", "Zonate lesions along leaf veins", "Premature leaf senescence"],
    causes: ["Corynespora cassiicola", "Moderate to high humidity", "Crowded plant canopy"],
    prevention: ["Increase spacing between tomato rows", "Remove crop debris immediately after harvest", "Apply targeted azoxystrobin fungicides"],
  },
  "yellow-leaf-curl-virus": {
    displayName: "Tomato Yellow Leaf Curl Virus",
    category: "Viral Disease (Begomovirus / TYLCV)",
    description: "Devastating viral infection vectored exclusively by the sweetpotato whitefly (Bemisia tabaci).",
    symptoms: ["Severe upward cupping and curling of leaf margins", "Interveinal yellowing and chlorosis", "Stunted bushy plant architecture and flower drop"],
    causes: ["Tomato Yellow Leaf Curl Virus", "Transmitted by Bemisia tabaci whiteflies", "Lack of insect screening"],
    prevention: ["Install 50-mesh insect netting in greenhouses", "Deploy yellow sticky traps for vector monitoring", "Spray neem oil or pyrethrin against whitefly nymphs"],
  },
  "tomato-mosaic-virus": {
    displayName: "Tomato Mosaic Virus",
    category: "Viral Disease (Tobamovirus / ToMV)",
    description: "Highly stable, contact-transmitted plant virus causing mottled leaf discoloration and distorted shoot growth.",
    symptoms: ["Light and dark green mosaic or mottling", "Fern-like or shoestring distorted leaf blades", "Internal brown necrosis in fruit"],
    causes: ["Tomato Mosaic Virus (ToMV)", "Mechanical transmission via workers, pruning tools, or infected seed", "Tobacco handling"],
    prevention: ["Disinfect pruning tools with 10% trisodium phosphate (TSP)", "Wash hands thoroughly before handling plants", "Rogue out and destroy infected specimens immediately"],
  },
};

export async function listDiseases() {
  if (mongoose.connection.readyState === 1) {
    try {
      const records = await Disease.find().sort({ displayName: 1 }).lean();
      if (records && records.length > 0) return records;
    } catch {
      // Fall through to default profiles
    }
  }
  return Object.values(DEFAULT_PROFILES);
}

export async function getDiseaseBySlug(slug) {
  if (mongoose.connection.readyState === 1) {
    try {
      const disease = await Disease.findOne({ slug }).lean();
      if (disease) return disease;
    } catch {
      // Fall through to default profiles
    }
  }
  if (DEFAULT_PROFILES[slug]) {
    return DEFAULT_PROFILES[slug];
  }
  throw ApiError.notFound("Disease not found");
}

/**
 * Runs deep learning vision diagnosis on an image (file or base64).
 */
export async function detectDiseaseService({ file, imageBase64, plantId, user }) {
  let tempFilePath = null;
  let targetPath = null;

  try {
    if (file && file.path) {
      targetPath = file.path;
    } else if (imageBase64) {
      // Decode base64 and save to temp file
      const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const rawData = matches ? matches[2] : imageBase64;
      const buffer = Buffer.from(rawData, "base64");

      const tempDir = os.tmpdir();
      tempFilePath = path.join(tempDir, `agritwin_leaf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`);
      fs.writeFileSync(tempFilePath, buffer);
      targetPath = tempFilePath;
    } else {
      throw ApiError.badRequest("No leaf image provided. Upload an image file or base64 string.");
    }

    const pythonBin = getPythonExecutable();
    const predictScript = path.join(WORKSPACE_ROOT, "ml", "inference", "predict.py");

    logger.info(`Running ML inference on: ${targetPath} using ${pythonBin}`);

    const args = [predictScript, "--image", targetPath, "--json"];
    
    // Execute python model prediction
    const { stdout, stderr } = await execFileAsync(pythonBin, args, {
      cwd: WORKSPACE_ROOT,
      timeout: 60000,
      env: {
        ...process.env,
        KERAS_BACKEND: "torch",
        KERAS_HOME: path.join(WORKSPACE_ROOT, ".keras"),
      },
    });

    if (stderr && !stdout) {
      logger.error(`ML Inference stderr: ${stderr}`);
      throw ApiError.internal(`ML model inference failed: ${stderr}`);
    }

    // Parse JSON output from predict.py
    let mlOutput;
    try {
      mlOutput = JSON.parse(stdout);
    } catch {
      // If stdout contains logs before JSON, find the json substring
      const jsonStart = stdout.indexOf("{");
      const jsonEnd = stdout.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        mlOutput = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
      } else {
        throw new Error(`Unable to parse model output: ${stdout}`);
      }
    }

    if (!mlOutput.success) {
      throw ApiError.internal(mlOutput.error || "Inference pipeline returned failure");
    }

    const rawClass = mlOutput.prediction.class_raw || "";
    const diseaseName = mlOutput.prediction.disease || "";
    let slug = CLASS_TO_SLUG[rawClass];
    if (!slug) {
      slug = diseaseName.toLowerCase().replace(/tomato\s*/i, "").trim().replace(/\s+/g, "-");
    }
    let diseaseRecord = null;
    if (mongoose.connection.readyState === 1) {
      try {
        diseaseRecord = await Disease.findOne({ slug }).lean();
      } catch (dbErr) {
        logger.warn(`Could not query disease record for slug ${slug}: ${dbErr.message}`);
      }
    }

    const isHealthy = slug === "healthy" || diseaseName.toLowerCase().includes("healthy");

    // If plantId provided and DB is connected, update the plant in MongoDB
    let updatedPlant = null;
    if (plantId && plantId !== "unassigned" && mongoose.connection.readyState === 1) {
      try {
        const query = { _id: plantId };
        if (user && user._id) {
          query.owner = user._id;
        }
        const plant = await Plant.findOne(query);
        if (plant) {
          plant.health = isHealthy ? "healthy" : "diseased";
          await plant.save();
          updatedPlant = plant;
          logger.info(`Updated plant ${plantId} health to ${plant.health}`);
        }
      } catch (plantErr) {
        logger.warn(`Could not update plant ${plantId}: ${plantErr.message}`);
      }
    }

    return {
      success: true,
      diagnosis: {
        disease: mlOutput.prediction.disease,
        slug,
        rawClass,
        confidence: mlOutput.prediction.confidence,
        confidencePct: `${(mlOutput.prediction.confidence * 100).toFixed(1)}%`,
        isHealthy,
        riskLevel: mlOutput.prediction.risk_level,
        model: mlOutput.model,
        plantId: plantId || null,
        plantName: updatedPlant ? updatedPlant.name : null,
      },
      diseaseProfile: diseaseRecord || DEFAULT_PROFILES[slug] || {
        displayName: mlOutput.prediction.disease,
        slug,
        category: isHealthy ? "Healthy" : "Infection Detected",
        description: "Diagnosis complete.",
        symptoms: [],
        causes: [],
        prevention: ["Maintain optimal watering and adequate air circulation."],
      },
      probabilities: mlOutput.probabilities || {},
      analyzedAt: new Date().toISOString(),
    };
  } finally {
    // Cleanup temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch {
        // Ignore
      }
    }
  }
}

/**
 * Predicts environmental disease risk using the Random Forest risk engine.
 */
export async function predictRiskService({ temperature, humidity, soilMoisture, leafWetness }) {
  const pythonBin = getPythonExecutable();
  const scriptPath = path.join(WORKSPACE_ROOT, "ml", "risk_prediction", "predict_risk.py");

  const temp = Number(temperature) || 26.0;
  const hum = Number(humidity) || 75.0;
  const soil = Number(soilMoisture) || 45.0;
  const wet = Number(leafWetness) || 60.0;

  const args = [
    scriptPath,
    "--temp", String(temp),
    "--humidity", String(hum),
    "--soil", String(soil),
    "--wetness", String(wet),
    "--json",
  ];

  try {
    const { stdout } = await execFileAsync(pythonBin, args, {
      cwd: WORKSPACE_ROOT,
      timeout: 15000,
    });

    const jsonStart = stdout.indexOf("{");
    const jsonEnd = stdout.lastIndexOf("}");
    const parsed = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
    return parsed;
  } catch (err) {
    logger.error(`Risk prediction failed: ${err.message}`);
    // Robust fallback calculation if python execution encounters an edge case
    const isHigh = hum > 80 || wet > 70 || temp > 31;
    const isMod = hum > 65 || wet > 50;
    const category = isHigh ? "High Risk" : isMod ? "Moderate Risk" : "Low Risk";
    const score = isHigh ? 78 : isMod ? 48 : 22;

    return {
      success: true,
      risk_category: category,
      risk_score: score,
      probabilities: {
        High: isHigh ? 0.75 : 0.15,
        Moderate: isMod ? 0.60 : 0.25,
        Low: isHigh ? 0.05 : 0.60,
      },
      input_telemetry: {
        temperature_c: temp,
        relative_humidity_pct: hum,
        soil_moisture_pct: soil,
        leaf_wetness_pct: wet,
      },
      factors: [
        { name: "Temperature", value: `${temp}°C`, severity: temp > 30 ? "High" : "Optimal" },
        { name: "Humidity", value: `${hum}%`, severity: hum > 80 ? "High" : "Optimal" },
      ],
      recommendations: ["Maintain proper air circulation and monitor leaf canopy moisture."],
    };
  }
}
