// src/infrastructure/http/express/routes/product.routes.ts
import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const controller = new ProductController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export { router as productRouter };
