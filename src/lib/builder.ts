import { builder } from "@builder.io/react";

// Initialize Builder with your API key
// Get your API key from: https://builder.io/account/settings
export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";

builder.init(BUILDER_API_KEY);

export { builder };
