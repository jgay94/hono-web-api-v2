import { Server } from "@lib/mod.ts";

if (import.meta.main) {
  new Server({
    app: {
      port: 8000,
    },
  }).start();
} else {
  console.warn("This module is not meant to be imported.");
}
