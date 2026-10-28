import {useId, useState} from "react";
import type {ChangeEvent, FormEvent} from "react";
import cx from "classnames";
import emailjs from "@emailjs/browser";
import styles from "../terminal/terminal.module.css";
import contact from "./mail-form.module.css";
import {emailJsConfig, isEmailJsConfigured} from "../../config/emailjs";
import {personalInfo} from "../../data/portfolio-data";

type FieldName = "name" | "email" | "whatsapp" | "subject" | "message";

interface LogLine {
    ok: boolean;
    title: string;
    description: string;
}

const EMPTY_FORM: Record<FieldName, string> = {name: "", email: "", whatsapp: "", subject: "", message: ""};

const FIELDS: { name: Exclude<FieldName, "message">; label: string; type: string; placeholder: string; required: boolean }[] = [
    {name: "name", label: "Full Name", type: "text", placeholder: "John Doe", required: true},
    {name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", required: true},
    {name: "whatsapp", label: "WhatsApp Number", type: "tel", placeholder: "+880 1234 567890", required: false},
    {name: "subject", label: "Subject", type: "text", placeholder: "Project Discussion", required: true},
];

/** Output of `mail` / `./mail.sh`: the EmailJS contact form, printed into the session. */
export function MailForm() {
    const idPrefix = useId();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [invalid, setInvalid] = useState<Partial<Record<FieldName, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [log, setLog] = useState<LogLine[]>([]);

    const report = (line: LogLine) => setLog((prev) => [...prev, line].slice(-3));

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setInvalid((prev) => ({...prev, [name]: false}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const missing = {
            name: !formData.name.trim(),
            email: !formData.email.trim(),
            subject: !formData.subject.trim(),
            message: !formData.message.trim(),
        };
        if (Object.values(missing).some(Boolean)) {
            setInvalid(missing);
            report({ok: false, title: "Validation Error", description: "Please fill in all required fields."});
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setInvalid({email: true});
            report({ok: false, title: "Invalid Email", description: "Please enter a valid email address."});
            return;
        }

        if (!isEmailJsConfigured()) {
            console.error("EmailJS is not configured. Please set up environment variables.");
            report({
                ok: false,
                title: "Email Service Not Configured",
                description: "Please configure EmailJS environment variables to send emails."
            });
            return;
        }

        setIsSubmitting(true);
        try {
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
                report({
                    ok: true,
                    title: "Message Sent Successfully!",
                    description: "Thank you for your message. I'll get back to you soon."
                });
                setFormData(EMPTY_FORM);
            }
        } catch (error) {
            console.error("EmailJS Error:", error);
            report({
                ok: false,
                title: "Failed to Send Message",
                description: "There was an error sending your message. Please try again or contact me directly."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={contact.page} aria-labelledby={`${idPrefix}title`}>
            <div className={contact.boot}>
                <span className={cx(styles.boot, styles.muted)} style={{animationDelay: ".1s"}}>
                    [<span className={styles.c3}>  OK  </span>] SMTP relay ready (EmailJS) — to: {personalInfo.email}
                </span>
            </div>

            <div className={styles.fadeUp} style={{animationDelay: ".2s"}}>
                <h2 id={`${idPrefix}title`} className={contact.title}>Get in Touch<span className={styles.cursor} aria-hidden="true"/></h2>
                <p className={styles.muted} style={{margin: 0}}>
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className={cx(styles.box, styles.fadeUp, contact.form)} style={{animationDelay: ".3s"}}>
                <div className={contact.grid}>
                    {FIELDS.map((field) => (
                        <div key={field.name} className={contact.field}>
                            <label htmlFor={idPrefix + field.name}>
                                <span className={styles.c1}>?</span> {field.label}{" "}
                                {field.required ? <span className={styles.c4}>*</span> : <span className={styles.muted}>(Optional)</span>}
                            </label>
                            <div className={contact.inputRow}>
                                <span className={styles.c2} aria-hidden="true">›</span>
                                <input
                                    id={idPrefix + field.name}
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    aria-invalid={invalid[field.name] || undefined}
                                    className={cx(contact.input, invalid[field.name] && contact.invalid)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={contact.field}>
                    <label htmlFor={`${idPrefix}message`}><span className={styles.c1}>?</span> Message <span className={styles.c4}>*</span></label>
                    <textarea
                        id={`${idPrefix}message`}
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or inquiry..."
                        aria-invalid={invalid.message || undefined}
                        className={cx(contact.input, invalid.message && contact.invalid)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className={contact.actions}>
                    <button type="submit" className={cx(styles.btn, styles.btnSolid, contact.submit)} disabled={isSubmitting}>
                        ↵ {isSubmitting ? "Sending..." : "Send Email"}
                    </button>
                    <span className={styles.muted} style={{fontSize: 14}}>fields marked * are required</span>
                </div>
            </form>

            <div role="status" aria-live="polite" className={contact.log}>
                {isSubmitting && <span className={cx(styles.muted, styles.spinner)}>Sending...</span>}
                {log.map((line, i) => (
                    <div key={i} className={styles.fadeUp}>
                        <span className={cx(styles.bold, line.ok ? styles.c3 : styles.c4)}>
                            {line.ok ? "[  OK  ]" : "[ FAIL ]"} {line.title}
                        </span>
                        <div className={styles.muted}>{line.description}</div>
                    </div>
                ))}
            </div>

            <div className={contact.direct}>
                <span className={styles.muted}># Or reach out directly:</span>
                <a href={`mailto:${personalInfo.email}`} className={styles.linkOut}>→ {personalInfo.email}</a>
                <a href={`tel:${personalInfo.phone}`} className={styles.linkOut}>→ +880 1823 923023</a>
            </div>
        </section>
    );
}
