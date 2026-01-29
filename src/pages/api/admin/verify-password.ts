import type { NextApiRequest, NextApiResponse } from "next";
import { serverSchema } from "../../../env/schema.mjs";

type ResponseData = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { password } = req.body;

    // Parse and validate environment variables
    const env = serverSchema.parse(process.env);

    // Check if password matches
    if (password === env.ADMIN_PASSWORD) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
