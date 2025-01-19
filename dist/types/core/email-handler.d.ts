import { NextFunction } from "express";
interface TemplateOptions {
    [key: string]: string;
}
interface EmailOptions {
    to: string;
    subject: string;
}
declare class EmailService {
    private transporter;
    private templateDir;
    constructor();
    /**
     * Load the email template and replace placeholders with the provided options.
     * @param templateName - Name of the email template file (without extension)
     * @param templateOptions - Placeholder values for the template
     * @returns Processed HTML content with placeholders replaced
     */
    private loadTemplate;
    /**
     * Send an email using the specified template and placeholder values.
     * @param options - Contains email recipient and subject
     * @param templateName - Name of the email template to use (without extension)
     * @param templateOptions - Placeholder values for the email template
     */
    sendEmail(options: EmailOptions, templateName: string, templateOptions: TemplateOptions, next: NextFunction): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
