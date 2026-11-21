import bcrypt from "bcryptjs";
import { env } from "./src/config/env.js";
import { connectDB, disconnectDB } from "./src/config/db.js";
import { logger } from "./src/config/logger.js";
import { User } from "./src/models/User.js";
import { Disease } from "./src/models/Disease.js";

const IMAGE_BASE = "https://tomatoanswers.com/wp-content/uploads/2026/09";

const diseases = [
  {
    slug: "healthy",
    displayName: "Healthy",
    category: "Healthy Tomato Leaf",
    description:
      "A healthy tomato leaf has a natural green colour and shows no visible signs of disease.",
    symptoms: [
      "Bright and natural green leaves",
      "Normal leaf shape and size",
      "Healthy plant growth",
    ],
    causes: ["Proper sunlight", "Balanced soil nutrients", "Suitable watering"],
    prevention: [
      "Maintain regular watering",
      "Provide adequate sunlight",
      "Monitor plant health regularly",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-healthy-plantvillage.webp`,
    isHealthy: true,
  },
  {
    slug: "early-blight",
    displayName: "Early Blight",
    category: "Fungal Disease",
    description:
      "Early Blight is a fungal disease that commonly affects tomato leaves, especially older leaves.",
    symptoms: [
      "Brown circular spots on leaves",
      "Concentric ring patterns",
      "Yellowing around affected areas",
    ],
    causes: [
      "Fungal infection by Alternaria solani",
      "Warm and humid weather",
      "Wet leaves for long periods",
    ],
    prevention: [
      "Remove infected leaves",
      "Avoid watering directly on leaves",
      "Maintain proper spacing between plants",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-early-blight-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "late-blight",
    displayName: "Late Blight",
    category: "Fungal Disease",
    description:
      "Late Blight is a serious tomato disease that can spread quickly during cool and humid weather.",
    symptoms: [
      "Dark water-soaked leaf patches",
      "Brown or black damaged areas",
      "White fungal growth in humid conditions",
    ],
    causes: [
      "Infection by Phytophthora infestans",
      "Cool and wet weather",
      "High humidity",
    ],
    prevention: [
      "Remove infected plant material",
      "Avoid overhead watering",
      "Ensure good air circulation",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-late-blight-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "bacterial-spot",
    displayName: "Bacterial Spot",
    category: "Bacterial Disease",
    description:
      "Bacterial Spot causes small dark lesions on tomato leaves and can affect fruits.",
    symptoms: [
      "Small dark spots on leaves",
      "Yellow areas around spots",
      "Leaf damage in severe cases",
    ],
    causes: [
      "Infection by Xanthomonas bacteria",
      "Wet and humid conditions",
      "Spread through contaminated tools and water",
    ],
    prevention: [
      "Use disease-free seeds",
      "Avoid working with wet plants",
      "Clean gardening tools regularly",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-bacterial-spot-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "septoria-leaf-spot",
    displayName: "Septoria Leaf Spot",
    category: "Fungal Disease",
    description:
      "Septoria Leaf Spot is a fungal disease that usually begins on older tomato leaves.",
    symptoms: [
      "Small circular spots",
      "Dark brown borders around spots",
      "Tiny dark structures inside spots",
    ],
    causes: [
      "Infection by Septoria lycopersici",
      "Warm and wet conditions",
      "Infected plant debris",
    ],
    prevention: [
      "Remove infected leaves",
      "Keep lower leaves away from soil",
      "Practice crop rotation",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-septoria-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "leaf-mold",
    displayName: "Leaf Mold",
    category: "Fungal Disease",
    description:
      "Leaf Mold is a fungal disease that mainly affects tomato leaves under high humidity.",
    symptoms: [
      "Pale green or yellow patches",
      "Olive-green mold underneath leaves",
      "Leaves may curl and dry",
    ],
    causes: [
      "Infection by Passalora fulva",
      "High humidity",
      "Poor air circulation",
    ],
    prevention: [
      "Improve air circulation",
      "Avoid excessive moisture",
      "Remove infected leaves",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-leaf-mold-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "target-spot",
    displayName: "Target Spot",
    category: "Fungal Disease",
    description:
      "Target Spot produces circular lesions on tomato leaves and may affect stems and fruits.",
    symptoms: [
      "Brown circular leaf spots",
      "Target-like ring patterns",
      "Yellowing and leaf damage",
    ],
    causes: [
      "Infection by Corynespora cassiicola",
      "Warm and humid conditions",
      "Poor air circulation",
    ],
    prevention: [
      "Remove infected leaves",
      "Maintain proper plant spacing",
      "Avoid excessive leaf moisture",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-target-spot-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "spider-mites",
    displayName: "Spider Mites",
    category: "Pest Damage",
    description:
      "Spider mites are tiny pests that feed on tomato leaves and damage plant tissues.",
    symptoms: [
      "Tiny yellow or white spots",
      "Fine webbing under leaves",
      "Dry and damaged leaves",
    ],
    causes: [
      "Spider mite infestation",
      "Hot and dry conditions",
      "Lack of regular pest monitoring",
    ],
    prevention: [
      "Inspect the underside of leaves",
      "Remove heavily infested leaves",
      "Use suitable pest control methods",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-spider-mites-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "tomato-mosaic-virus",
    displayName: "Tomato Mosaic Virus",
    category: "Viral Disease",
    description:
      "Tomato Mosaic Virus affects tomato growth and produces irregular colour patterns on leaves.",
    symptoms: [
      "Light and dark green mosaic patterns",
      "Wrinkled or distorted leaves",
      "Reduced plant growth",
    ],
    causes: [
      "Infection by Tomato Mosaic Virus",
      "Contaminated tools and hands",
      "Infected plant material",
    ],
    prevention: [
      "Use clean gardening tools",
      "Remove infected plants",
      "Wash hands after handling infected plants",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-mosaic-plantvillage.webp`,
    isHealthy: false,
  },
  {
    slug: "tomato-yellow-leaf-curl-virus",
    displayName: "Tomato Yellow Leaf Curl Virus",
    category: "Viral Disease",
    description:
      "Tomato Yellow Leaf Curl Virus is a viral disease that affects leaf shape and plant growth.",
    symptoms: [
      "Yellowing of leaf margins",
      "Upward curling of leaves",
      "Stunted plant growth",
    ],
    causes: [
      "Infection by Tomato Yellow Leaf Curl Virus",
      "Spread mainly by whiteflies",
      "Presence of infected plants",
    ],
    prevention: [
      "Monitor and manage whiteflies",
      "Remove infected plants",
      "Use suitable protective netting",
    ],
    referenceImage: `${IMAGE_BASE}/tomato-leaf-yellow-leaf-curl-plantvillage.webp`,
    isHealthy: false,
  },
];

async function seedDiseases() {
  for (const disease of diseases) {
    await Disease.updateOne(
      { slug: disease.slug },
      { $set: disease },
      { upsert: true }
    );
  }

  const count = await Disease.countDocuments();
  logger.info(`Diseases seeded: ${count}`);
}

async function seedAdmin() {
  const existing = await User.findOne({ username: env.ADMIN_USERNAME });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      logger.info(`Existing user "${env.ADMIN_USERNAME}" promoted to admin`);
    } else {
      logger.info(`Admin "${env.ADMIN_USERNAME}" already exists`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_ROUNDS);

  await User.create({
    username: env.ADMIN_USERNAME,
    email: env.ADMIN_EMAIL,
    passwordHash,
    role: "admin",
  });

  logger.info(`Admin created: ${env.ADMIN_USERNAME}`);
}

async function main() {
  try {
    await connectDB();
    await seedDiseases();
    await seedAdmin();
    logger.info("Seed complete");
  } catch (error) {
    logger.error("Seed failed", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

main();