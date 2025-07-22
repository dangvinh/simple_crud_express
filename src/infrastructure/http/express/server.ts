import { env } from "@/config/env.config";
import { app } from "./app";

const PORT = env.PORT;

export async function bootstrap(): Promise<void> {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}
