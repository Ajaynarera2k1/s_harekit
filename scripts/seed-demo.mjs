import dotenv from "dotenv";
import mongoose from "mongoose";
import { cp, mkdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import PlanModel from "../model/plan.model.js";
import UserModel from "../model/user.model.js";
import FileModel from "../model/file.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const plans = [
  { name: "starter", storage: 200 * 1000 * 1000, price: 0 },
  { name: "pro", storage: 2 * 1000 * 1000 * 1000, price: 499 },
  { name: "corporate", storage: 10 * 1000 * 1000 * 1000, price: 1800 },
];

const demoUser = {
  fullname: "Demo Candidate",
  email: "demo@sharekit.app",
  password: "Demo@12345",
};

const demoFiles = [
  {
    source: path.join(rootDir, "demo-assets", "welcome-pack.html"),
    targetName: "welcome-pack.html",
  },
  {
    source: path.join(rootDir, "demo-assets", "pricing-sheet.html"),
    targetName: "pricing-sheet.html",
  },
];

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensurePlans() {
  const createdPlans = {};

  for (const plan of plans) {
    const existing = await PlanModel.findOneAndUpdate(
      { name: plan.name },
      plan,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdPlans[plan.name] = existing;
  }

  return createdPlans;
}

async function ensureDemoUser(starterPlanId) {
  let user = await UserModel.findOne({ email: demoUser.email });

  if (!user) {
    user = new UserModel({
      ...demoUser,
      plan: starterPlanId,
    });
    await user.save();
    return user;
  }

  if (!user.plan || user.plan.toString() !== starterPlanId.toString()) {
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { plan: starterPlanId } }
    );
    user.plan = starterPlanId;
  }

  return user;
}

async function ensureDemoFiles(userId) {
  const storageDir = path.join(rootDir, "storage", "files");
  await mkdir(storageDir, { recursive: true });

  for (const file of demoFiles) {
    const targetPath = path.join(storageDir, file.targetName);
    if (!(await exists(targetPath))) {
      await cp(file.source, targetPath);
    }

    const relativePath = `storage/files/${file.targetName}`;
    const fileExists = await FileModel.findOne({
      user: userId,
      path: relativePath,
    });

    if (fileExists) {
      continue;
    }

    const fileInfo = await stat(targetPath);
    await FileModel.create({
      user: userId,
      filename: file.targetName,
      type: "text",
      size: fileInfo.size,
      path: relativePath,
    });
  }
}

async function main() {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is required to seed demo data");
  }

  await mongoose.connect(process.env.DB_URL);

  const planMap = await ensurePlans();
  const user = await ensureDemoUser(planMap.starter._id);
  await ensureDemoFiles(user._id);

  console.log("Demo seed complete.");
  console.log(`Login email: ${demoUser.email}`);
  console.log(`Login password: ${demoUser.password}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Demo seed failed:", error.message);

  try {
    await mongoose.disconnect();
  } catch {
    // Ignore disconnect cleanup errors.
  }

  process.exitCode = 1;
});
