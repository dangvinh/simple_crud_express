import { env } from "@/config/env";
import { app } from "./app";

const PORT = env.PORT;

export function bootstrap(): void {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}
