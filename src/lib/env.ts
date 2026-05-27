import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    POLAR_ACCESS_TOKEN: z.string().optional().default(""),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox"),
    POLAR_PRODUCT_ID: z.string().optional().default(""),
    POLAR_METER_VOICE_CREATION: z.string().optional().default(""),
    POLAR_METER_TTS_GENERATION: z.string().optional().default(""),
    POLAR_METER_TTS_PROPERTY: z.string().optional().default(""),
    DATABASE_URL: z.string().min(1),
    APP_URL: z.string().min(1),
    R2_ACCOUNT_ID: z.string().optional().default(""),
    R2_ACCESS_KEY_ID: z.string().optional().default(""),
    R2_SECRET_ACCESS_KEY: z.string().optional().default(""),
    R2_BUCKET_NAME: z.string().optional().default(""),
    CHATTERBOX_API_URL: z.string().optional().default(""),
    CHATTERBOX_API_KEY: z.string().optional().default(""),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
