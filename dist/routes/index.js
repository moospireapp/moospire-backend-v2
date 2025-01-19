import { env } from "../config/index.js";
import baseRoutes from "../routes/base-routes.js";
import { authRoute } from "../modules/auth-module/index.js";
import { oAuthRoute } from "../modules/o-auth-module/index.js";
import { profileRoute } from "../modules/profile-module/index.js";
let appInstance;
/**
 * A wrapper function to set the API version prefix for all routes.
 * @param routePath - The path of the route.
 * @param router - The router instance.
 */
const routeSetup = (routePath, router) => {
    appInstance.use(`/${env.API_VERSION}${routePath}`, router);
};
/**
 * Load all application routes.
 * @param app - The express application instance.
 */
const loadAppRoutes = (app) => {
    appInstance = app;
    routeSetup("/", baseRoutes);
    routeSetup("/auth", authRoute);
    routeSetup("/oauth", oAuthRoute);
    routeSetup("/profile", profileRoute);
};
export default loadAppRoutes;
//# sourceMappingURL=index.js.map