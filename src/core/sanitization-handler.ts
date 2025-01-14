import bcrypt from "bcryptjs";
import { env, appLogger } from "@/config/index.js";

class Sanitization {
  body_data: string = "";

  /**
   * It takes a password as an argument, generates a salt, and then hashes the password with the salt.
   * @param password - The password to be hashed.
   * @returns A promise that resolves to the hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      /* Generate a salt */
      const salt = await bcrypt.genSalt(Number(env.SALT_ROUND));

      /* Hash password */
      return await bcrypt.hash(password, salt);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      appLogger.error(errorMessage);
      return errorMessage;
    }
  }

  /**
   * Capitalizes the first letter of each word in body_data.
   * @returns The capitalized text.
   */
  private getCapitalizeText(): string {
    const text_list = this.body_data?.split(" ") || [];
    const modified_list = text_list.map(
      (text) => `${text.charAt(0).toUpperCase()}${text.substring(1)}`
    );

    return modified_list.join(" ");
  }

  /**
   * Sets the body_data for the class instance.
   * @param body_data - The data to be sanitized.
   * @returns The instance of the class.
   */
  body(body_data: string): this {
    this.body_data = body_data;
    return this;
  }

  /**
   * Trims the body_data based on the specified format.
   * @param format - Specifies where to trim: "left", "right", or trims both by default.
   * @returns The instance of the class.
   */
  toTrim(format: "left" | "right" | null = null): this {
    if (format === "left") {
      this.body_data = this.body_data?.trimStart();
    } else if (format === "right") {
      this.body_data = this.body_data?.trimEnd();
    } else {
      this.body_data = this.body_data?.trim();
    }
    return this;
  }

  /**
   * Converts the case of body_data based on the case_type.
   * @param case_type - Specifies the case type: "upper", "lower", or "capitalize".
   * @returns The instance of the class.
   */
  toCase(case_type: "upper" | "lower" | "capitalize" | null = null): this {
    if (case_type === "upper") {
      this.body_data = this.body_data?.toUpperCase();
    } else if (case_type === "lower") {
      this.body_data = this.body_data?.toLowerCase();
    } else {
      this.body_data = this.getCapitalizeText();
    }
    return this;
  }

  /**
   * Hashes the body_data using bcrypt.
   * @returns A promise that resolves when the body_data is hashed.
   */
  async toHash(): Promise<this> {
    this.body_data = await this.hashPassword(this.body_data);
    return this;
  }
}

export default new Sanitization();
