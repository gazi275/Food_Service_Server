/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlemmail";
import { client, sender } from "./mailtrap";
import { generatePasswordResetEmailHtml } from './htmlemmail';

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    try {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html:htmlContent.replace("{verificationToken}", verificationToken),
            category: 'Email Verification'
        });
    } catch (error) {
      
        throw new Error("Failed to send email verification")

    }
}
export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Welcome',
            html:htmlContent,
            template_variables:{
                company_info_name:"Azad",
                name:name
            }
        });
    } catch (error) {
      
        throw new Error("Failed to send welcome email")
    }
}
export const sendPasswordResetEmail = async (email:string, resetURL:string) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html:htmlContent,
            category:"Reset Password"
        });
    } catch (error) {
    
        throw new Error("Failed to reset password")
    }
}
export const sendResetSuccessEmail = async (email:string) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Successfully',
            html:htmlContent,
            category:"Password Reset"
        });
    } catch (error) {
 
        throw new Error("Failed to send password reset success email");
    }
}