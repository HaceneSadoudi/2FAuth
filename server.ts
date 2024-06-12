import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

export const prisma = new PrismaClient();
export const app = express();

async function main() {
  // Middleware
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(express.json());
  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "2FAuth Express API with Swagger",
        version: "0.1.0",
        description:
          "2FAuth CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "sadoudi",
          url: "https://github.com/HaceneSadoudi",
        },
      },
      servers: [
        {
          url: "http://localhost:8000",
        },
      ],
    },
    apis: ["./routes/*.ts"],
  };
  const specs = swaggerJsdoc(options);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));  
  //   Health Checker
  app.get("/api/check", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to Two-Factor Authentication ✌️",
    });
  });

  // Register the API Routes
  app.use("/api/auth", authRoutes);

  // Catch All
  app.all("*", (req: Request, res: Response) => {
    return res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} not found`,
    });
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.info(`Server started on port: ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });