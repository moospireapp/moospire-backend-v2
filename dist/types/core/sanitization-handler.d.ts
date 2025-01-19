declare class Sanitization {
    body_data: string;
    /**
     * It takes a password as an argument, generates a salt, and then hashes the password with the salt.
     * @param password - The password to be hashed.
     * @returns A promise that resolves to the hashed password.
     */
    private hashPassword;
    /**
     * Capitalizes the first letter of each word in body_data.
     * @returns The capitalized text.
     */
    private getCapitalizeText;
    /**
     * Sets the body_data for the class instance.
     * @param body_data - The data to be sanitized.
     * @returns The instance of the class.
     */
    body(body_data: string): this;
    /**
     * Trims the body_data based on the specified format.
     * @param format - Specifies where to trim: "left", "right", or trims both by default.
     * @returns The instance of the class.
     */
    toTrim(format?: "left" | "right" | null): this;
    /**
     * Converts the case of body_data based on the case_type.
     * @param case_type - Specifies the case type: "upper", "lower", or "capitalize".
     * @returns The instance of the class.
     */
    toCase(case_type?: "upper" | "lower" | "capitalize" | null): this;
    /**
     * Hashes the body_data using bcrypt.
     * @returns A promise that resolves when the body_data is hashed.
     */
    toHash(): Promise<this>;
}
declare const _default: Sanitization;
export default _default;
