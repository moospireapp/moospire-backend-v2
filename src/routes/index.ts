import { Application, Router } from "express";
import { env } from "@/config";
import baseRoutes from "@/routes/base-routes";
import { authRoute } from "@/modules/auth-module";
import { oAuthRoute } from "@/modules/o-auth-module";
import { profileRoute } from "@/modules/profile-module";

let appInstance: Application;

/**
 * A wrapper function to set the API version prefix for all routes.
 * @param routePath - The path of the route.
 * @param router - The router instance.
 */
const routeSetup = (routePath: string, router: Router) => {
  appInstance.use(`/${env.API_VERSION}${routePath}`, router);
};

/**
 * Load all application routes.
 * @param app - The express application instance.
 */
const loadAppRoutes = (app: Application): void => {
  appInstance = app;

  routeSetup("/", baseRoutes);
  routeSetup("/auth", authRoute);
  routeSetup("/oauth", oAuthRoute);
  routeSetup("/profile", profileRoute);
};

export default loadAppRoutes;
