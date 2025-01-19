declare class ValidatorService {
    private body_field;
    private body_payload;
    private error_messages;
    private readonly email_regex;
    private readonly strongPassword;
    private readonly mediumPassword;
    /**
     * Sets the body_payload and body_field variables to the inputValue and fieldValue parameters.
     * @param inputValue - The value of the input field.
     * @param fieldValue - The field name of the field you want to search for.
     * @returns The instance of the class.
     */
    body(inputValue: any, fieldValue: string): this;
    /**
     * If the request is invalid, respond with a 400 Bad Request error and the first error message
     * @param next - A callback function to handle the response.
     * @returns The validate method is being returned.
     */
    validate(next: (status: any) => void): boolean;
    /**
     * If there are any error messages, validate the form
     * @param next - A callback function to handle the response.
     * @returns The error messages array.
     */
    validationFailed(next: () => void): void;
    /**
     * Checks if the input is valid and if it is not valid, pushes the invalid message to the error_messages array.
     * @param is_valid - A boolean value that determines if the input is valid or not.
     * @param invalid_msg - The message to display if the field is invalid.
     * @returns The instance of the class.
     */
    checkIfValid(is_valid: boolean, invalid_msg: string): this;
    /**
     * Checks if the body_payload is present and returns a boolean value.
     * @returns The return value is a boolean.
     */
    required(): this;
    /**
     * Checks if the body_payload is a string.
     * @returns The instance of the class.
     */
    isString(): this;
    /**
     * Checks if the body_payload is a number.
     * @returns The instance of the class.
     */
    isNumber(): this;
    /**
     * Checks if the body_payload is an array and if it is, checks if it's empty.
     * @returns The return value of the checkIfValid function.
     */
    notEmpty(): this;
    /**
     * Checks if the value of the body field is one of the allowed items.
     * @param allowed_items - An array of allowed items.
     * @returns A boolean value.
     */
    containsOne(allowed_items?: string[]): this;
    /**
     * Checks if the body_payload is a valid email address.
     * @returns The return value is a boolean.
     */
    email(): this;
    /**
     * Checks if the length of the body_payload is greater than or equal to the min_length.
     * @param min_length - The minimum length of the body field.
     * @returns The return value is a boolean.
     */
    minLength(min_length: number): this;
    /**
     * Checks if the length of the body_payload is greater than the max_length.
     * @param max_length - The maximum length of the field.
     * @returns The return value is a boolean.
     */
    maxLength(max_length: number): this;
    /**
     * Checks if the password provided is strong or medium.
     * @returns The return value is a boolean value.
     */
    strongPwd(): this;
    /**
     * Checks if the number of words in the body field is equal to the number of words passed in as an argument.
     * @param count - The number of words the body should contain.
     * @returns A boolean value.
     */
    wordCount(count: number): this;
    /**
     * Checks if the file size is greater than the specified size.
     * @param file_size - The maximum file size in bytes.
     * @returns The instance of the class.
     */
    fileSize(file_size: number): this;
    /**
     * Checks if the file type of the file uploaded is within the allowed types.
     * @param allowed_types - An array of allowed file types.
     * @returns The instance of the class.
     */
    fileType(allowed_types?: string[]): this;
}
declare const _default: ValidatorService;
export default _default;
