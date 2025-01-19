import listEndpoints from "express-list-endpoints";
import { notFoundHandler, errorHandler } from "../../middlewares/index.js";
/**
 * This function loads final middlewares for the application.
 * @param app - The express application instance.
 */
const loadFinalMiddlewares = (app) => {
    /* A middleware that will catch any request that is not handled by any other middleware. */
    app.all("*", (req, res, next) => notFoundHandler(req, res, next, listEndpoints(app)));
    /* A middleware that will catch any error that is thrown in the application. */
    app.use(errorHandler);
};
export default loadFinalMiddlewares;
//# sourceMappingURL=final-middleware.js.map