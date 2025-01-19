import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
import { env, appLogger } from "../config/index.js";
import { getFileDir } from "../utilities/index.js";
import { apiStatus } from "../core/index.js";
// Create __dirname equivalent for ES modules
const __dirname = getFileDir(import.meta.url);
class EmailService {
    transporter;
    templateDir;
    constructor() {
        // Set up the directory where templates are stored
        this.templateDir = path.resolve(__dirname, "../templates");
        // Check the email provider in environment variables
        if (env.EMAIL_PROVIDER === "mailgun") {
            // Configure Mailgun transporter
            this.transporter = nodemailer.createTransport(mailgun({
                auth: {
                    api_key: env.MAILGUN_API_KEY,
                    domain: env.MAILGUN_DOMAIN,
                },
            }));
        }
        else {
            // Configure SMTP transporter
            this.transporter = nodemailer.createTransport({
                service: env.SMTP_SERVICE,
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
        }
    }
    /**
     * Load the email template and replace placeholders with the provided options.
     * @param templateName - Name of the email template file (without extension)
     * @param templateOptions - Placeholder values for the template
     * @returns Processed HTML content with placeholders replaced
     */
    loadTemplate(templateName, templateOptions) {
        const templatePath = path.join(this.templateDir, `${templateName}.html`);
        // Read the HTML file
        let htmlContent = fs.readFileSync(templatePath, "utf-8");
        // Replace placeholders like {{key}} with actual values from templateOptions
        for (const [key, value] of Object.entries(templateOptions)) {
            const placeholder = `{{${key}}}`;
            htmlContent = htmlContent.replace(new RegExp(placeholder, "g"), value);
        }
        return htmlContent;
    }
    /**
     * Send an email using the specified template and placeholder values.
     * @param options - Contains email recipient and subject
     * @param templateName - Name of the email template to use (without extension)
     * @param templateOptions - Placeholder values for the email template
     */
    async sendEmail(options, templateName, templateOptions, next) {
        try {
            // Load and process the HTML email template
            const htmlContent = this.loadTemplate(templateName, templateOptions);
            // Define the mail options
            const mailOptions = {
                from: env.SMTP_USER, // Sender address
                to: options.to, // Recipient email address
                subject: options.subject, // Email subject
                html: htmlContent, // HTML content from the template
            };
            // Send the email using the configured transporter
            const info = await this.transporter.sendMail(mailOptions);
            appLogger.info("Email sent successfully:", info.response);
            return true; // Return true if the email was sent successfully
        }
        catch (error) {
            appLogger.error("Error sending email:", error);
            // Call next() to pass the error to the error middleware
            next(apiStatus.internal("Error sending email"));
            throw error;
        }
    }
}
export default new EmailService();
//# sourceMappingURL=email-handler.js.map