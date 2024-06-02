import "@/db/envConfig";
import { defineConfig } from "drizzle-kit";

if (!("POSTGRES_URL" in process.env))
  throw new Error("POSTGRES_URL not found on env file");

export default defineConfig({
  schema: "src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
