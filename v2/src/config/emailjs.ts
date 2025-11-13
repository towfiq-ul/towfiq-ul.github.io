/**
 * EmailJS Configuration
 * 
 * To set up EmailJS:
 * 1. Create an account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with the following variables:
 *    - from_name (sender's name)
 *    - from_email (sender's email)
 *    - whatsapp_number (optional WhatsApp number)
 *    - subject (message subject)
 *    - message (message content)
 * 4. Get your Public Key from Account > General
 * 5. Set the environment variables in .env file
 */

export const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

export const isEmailJsConfigured = () => {
  return Boolean(
    emailJsConfig.serviceId && 
    emailJsConfig.templateId && 
    emailJsConfig.publicKey
  );
};
