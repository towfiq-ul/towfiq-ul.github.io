import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, User, Phone, MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";
import styles from "./Contact.module.css";
import { Button } from "../components/ui/button/button";
import { Input } from "../components/ui/input/input";
import { Textarea } from "../components/ui/textarea/textarea";
import { Label } from "../components/ui/label/label";
import { useToast } from "../hooks/use-toast";
import { Particles } from "../components/particles/particles";
import { emailJsConfig, isEmailJsConfigured } from "../config/emailjs";

interface ContactProps {
  onClose: () => void;
}

export function Contact({ onClose }: ContactProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if EmailJS is configured
    if (!isEmailJsConfigured()) {
      toast({
        title: "Email Service Not Configured",
        description: "Please configure EmailJS environment variables to send emails.",
        variant: "destructive",
      });
      console.error("EmailJS is not configured. Please set up environment variables.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send email using EmailJS
        const result = await emailjs.send(
            emailJsConfig.serviceId,
            emailJsConfig.templateId,
            {
                name: formData.name,
                email: formData.email,
                whatsapp: formData.whatsapp || "Not provided",
                subject: formData.subject,
                message: formData.message,
                to_email: emailJsConfig.receiverEmail,
                time: String(new Date()),
            },
            emailJsConfig.publicKey
        );

      if (result.status === 200) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for your message. I'll get back to you soon.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          whatsapp: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <Particles />
      
      <div className={styles.container}>
        <button onClick={onClose} className={styles.backButton} aria-label="Go back">
          <ArrowLeft />
          <span>Back to Portfolio</span>
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Mail className={styles.headerIcon} />
            </div>
            <h1 className={styles.title}>Get in Touch</h1>
            <p className={styles.subtitle}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
              visions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <Label htmlFor="name" className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </Label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="email" className={styles.label}>
                Email Address <span className={styles.required}>*</span>
              </Label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="whatsapp" className={styles.label}>
                WhatsApp Number <span className={styles.optional}>(Optional)</span>
              </Label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} />
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="+880 1234 567890"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="subject" className={styles.label}>
                Subject <span className={styles.required}>*</span>
              </Label>
              <div className={styles.inputWrapper}>
                <MessageSquare className={styles.inputIcon} />
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project Discussion"
                  value={formData.subject}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="message" className={styles.label}>
                Message <span className={styles.required}>*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project or inquiry..."
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                rows={6}
                required
              />
            </div>

            <Button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className={styles.buttonIcon} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Send className={styles.buttonIcon} />
              )}
              {isSubmitting ? "Sending..." : "Send Email"}
            </Button>
          </form>

          <div className={styles.contactInfo}>
            <p className={styles.infoText}>Or reach out directly:</p>
            <div className={styles.infoLinks}>
              <a href="mailto:towfiq.106@gmail.com" className={styles.infoLink}>
                <Mail className={styles.infoIcon} />
                towfiq.106@gmail.com
              </a>
              <a href="tel:+8801823923023" className={styles.infoLink}>
                <Phone className={styles.infoIcon} />
                +880 1823 923023
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
