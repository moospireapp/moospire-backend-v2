import express, { Application } from "express";
// import rateLimiter from "express-rate-limit";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import cors from "cors";
import { httpLogger, env } from "@/config";

const allowedOrigins = env.ALLOWED_ORIGINS as string;

// Setting up the CORS options for the application.
const setupCORSOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Setting up the rate limiter options for the application.
// const setupRateLimiterOptions = {
//   windowMs: env.RATE_LIMIT_REQUEST_PER_SECOND * 1000, // Convert seconds to ms
//   max: env.RATE_LIMIT_REQUEST,
// };

const fileUploadLimit: fileUpload.Options = {
  limits: { fileSize: env.FILE_SIZE_BASE * 1024 * 1024 },
  abortOnLimit: true,
};

/**
 * This function loads the initial middleware for the application.
 * @param app - The express app.
 * @param express - The express instance.
 */
const runInitialMiddleware = (app: Application) => {
  app.set("trust proxy", true);
  app.use(compression());
  app.use(cookieParser());
  app.use(fileUpload(fileUploadLimit));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors(setupCORSOptions));
  // app.use(rateLimiter(setupRateLimiterOptions));

  app.use((req, res, next) => {
    let origin = req.headers.origin || "";
    let theOrigin =
      allowedOrigins.indexOf(origin) >= 0 ? origin : allowedOrigins[0];

    res.header("Access-Control-Allow-Origin", theOrigin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    next();
  });

  // Handle the path resolution for static files
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const templatesPath = path.join(__dirname, "templates");

  // Make sure to decode the pathname, especially for ESM
  app.use(express.static(decodeURIComponent(templatesPath)));

  app.use(httpLogger("http-error-logs.log", true));
  app.use(httpLogger("http-logs.log"));
};

export default runInitialMiddleware;
