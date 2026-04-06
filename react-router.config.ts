import type { Config } from "@react-router/dev/config";

export default {
  // Serve the app as a static SPA and fetch runtime data from the Laravel API.
  ssr: false,
} satisfies Config;
