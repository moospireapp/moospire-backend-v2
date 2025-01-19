import { validate, asyncWrapper } from "../../core/index.js";
class ProfileValidator {
    // Validate user profile data
    validateProfileData = asyncWrapper(async (req, _res, next) => {
        const { user_data } = req.body;
        /* VALIDATION SERVICE LAYER */
        validate
            .body(user_data, "user data")
            .required()
            .notEmpty()
            .validationFailed(next);
    });
    // Validate user profile type
    validateProfileType = asyncWrapper(async (req, _res, next) => {
        const { user_type } = req.body;
        /* VALIDATION SERVICE LAYER */
        validate
            .body(user_type, "user type")
            .required()
            .isString()
            .validationFailed(next);
    });
}
// Exporting an instantiated class object
export default new ProfileValidator();
//# sourceMappingURL=profile-validators.js.map