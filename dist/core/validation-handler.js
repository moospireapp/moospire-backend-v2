import path from "path";
import { apiStatus } from "../core/index.js";
class ValidatorService {
    body_field = "";
    body_payload = "";
    error_messages = [];
    email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   private readonly phone_regex: RegExp = /(^[0]\d{10}$)|(^[\+]?[234]\d{12}$)/;
    strongPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    mediumPassword = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;
    /**
     * Sets the body_payload and body_field variables to the inputValue and fieldValue parameters.
     * @param inputValue - The value of the input field.
     * @param fieldValue - The field name of the field you want to search for.
     * @returns The instance of the class.
     */
    body(inputValue, fieldValue) {
        this.body_payload = inputValue;
        this.body_field = fieldValue;
        return this;
    }
    /**
     * If the request is invalid, respond with a 400 Bad Request error and the first error message
     * @param next - A callback function to handle the response.
     * @returns The validate method is being returned.
     */
    validate(next) {
        const error_msg = this.error_messages[0];
        this.error_messages = [];
        next(apiStatus.badRequest(error_msg));
        return true;
    }
    /**
     * If there are any error messages, validate the form
     * @param next - A callback function to handle the response.
     * @returns The error messages array.
     */
    validationFailed(next) {
        if (this.error_messages.length) {
            this.validate(next);
        }
        else {
            next();
        }
    }
    /**
     * Checks if the input is valid and if it is not valid, pushes the invalid message to the error_messages array.
     * @param is_valid - A boolean value that determines if the input is valid or not.
     * @param invalid_msg - The message to display if the field is invalid.
     * @returns The instance of the class.
     */
    checkIfValid(is_valid, invalid_msg) {
        if (!is_valid) {
            this.error_messages.push(invalid_msg);
        }
        return this;
    }
    /**
     * Checks if the body_payload is present and returns a boolean value.
     * @returns The return value is a boolean.
     */
    required() {
        const required = !!this.body_payload;
        return this.checkIfValid(required, `${this.body_field} is required`);
    }
    /**
     * Checks if the body_payload is a string.
     * @returns The instance of the class.
     */
    isString() {
        const is_string = typeof this.body_payload === "string";
        return this.checkIfValid(is_string, `${this.body_field} must be a string`);
    }
    /**
     * Checks if the body_payload is a number.
     * @returns The instance of the class.
     */
    isNumber() {
        const is_number = typeof this.body_payload === "number";
        return this.checkIfValid(is_number, `${this.body_field} must be a number`);
    }
    /**
     * Checks if the body_payload is an array and if it is, checks if it's empty.
     * @returns The return value of the checkIfValid function.
     */
    notEmpty() {
        if (Array.isArray(this.body_payload)) {
            const is_not_empty = this.body_payload.length > 0;
            return this.checkIfValid(is_not_empty, `${this.body_field} is empty`);
        }
        else {
            return this.checkIfValid(false, `${this.body_field} is not an array`);
        }
    }
    /**
     * Checks if the value of the body field is one of the allowed items.
     * @param allowed_items - An array of allowed items.
     * @returns A boolean value.
     */
    containsOne(allowed_items = []) {
        const contains_one = allowed_items.includes(this.body_payload);
        return this.checkIfValid(contains_one, `${this.body_payload} is not a valid ${this.body_field} item`);
    }
    /**
     * Checks if the body_payload is a valid email address.
     * @returns The return value is a boolean.
     */
    email() {
        const is_email = this.email_regex.test(String(this.body_payload).toLowerCase());
        return this.checkIfValid(is_email, `${this.body_payload} is not a valid email`);
    }
    /**
     * Checks if the length of the body_payload is greater than or equal to the min_length.
     * @param min_length - The minimum length of the body field.
     * @returns The return value is a boolean.
     */
    minLength(min_length) {
        const is_min_length = this.body_payload?.length >= min_length;
        return this.checkIfValid(is_min_length, `${this.body_field} is less than ${min_length} characters`);
    }
    /**
     * Checks if the length of the body_payload is greater than the max_length.
     * @param max_length - The maximum length of the field.
     * @returns The return value is a boolean.
     */
    maxLength(max_length) {
        const is_max_length = max_length > this.body_payload?.length;
        return this.checkIfValid(is_max_length, `${this.body_field} is greater than ${max_length} characters`);
    }
    /**
     * Checks if the password provided is strong or medium.
     * @returns The return value is a boolean value.
     */
    strongPwd() {
        const is_strong_pwd = this.strongPassword.test(this.body_payload) ||
            this.mediumPassword.test(this.body_payload);
        return this.checkIfValid(is_strong_pwd, `${this.body_field} provided is weak`);
    }
    /**
     * Checks if the number of words in the body field is equal to the number of words passed in as an argument.
     * @param count - The number of words the body should contain.
     * @returns A boolean value.
     */
    wordCount(count) {
        const is_valid_count = this.body_payload.split(" ").length === count;
        return this.checkIfValid(is_valid_count, `${this.body_field} should contain exactly ${count} words`);
    }
    /**
     * Checks if the file size is greater than the specified size.
     * @param file_size - The maximum file size in bytes.
     * @returns The instance of the class.
     */
    fileSize(file_size) {
        if (this.body_payload) {
            const body_size = this.body_payload.size;
            const is_valid_file_size = file_size >= body_size;
            return this.checkIfValid(is_valid_file_size, `${this.body_field} size is greater than ${file_size}`);
        }
        return this;
    }
    /**
     * Checks if the file type of the file uploaded is within the allowed types.
     * @param allowed_types - An array of allowed file types.
     * @returns The instance of the class.
     */
    fileType(allowed_types = []) {
        if (this.body_payload) {
            const file_type = path.extname(this.body_payload.name);
            const is_valid_file_type = allowed_types.includes(file_type);
            return this.checkIfValid(is_valid_file_type, `${this.body_field} is not within the range of valid types: ${allowed_types.join(", ")}`);
        }
        return this;
    }
}
export default new ValidatorService();
//# sourceMappingURL=validation-handler.js.map