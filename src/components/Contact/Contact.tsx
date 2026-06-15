"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import styles from "./Contact.module.css";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation function
  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name") {
      if (!value) return "O nome é obrigatório.";
      if (value.length < 3) return "O nome deve ter no mínimo 3 caracteres.";
    }
    if (name === "email") {
      if (!value) return "O e-mail é obrigatório.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Por favor, insira um e-mail válido.";
    }
    if (name === "phone") {
      if (!value) return "O telefone é obrigatório.";
      if (value.replace(/\D/g, "").length < 10) return "Por favor, insira um telefone com DDD.";
    }
    if (name === "message") {
      if (!value) return "A mensagem é obrigatória.";
      if (value.length < 10) return "A mensagem deve conter no mínimo 10 caracteres.";
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    
    // Validate on type if touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    const touchedFields: Record<string, boolean> = {};
    
    Object.keys(fields).forEach((key) => {
      touchedFields[key] = true;
      const error = validateField(key, fields[key as keyof FormFields]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setTouched(touchedFields);
    setErrors(newErrors);

    // If there are errors, stop
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className={styles.contactSection}>
      {/* Light glow effects */}
      <div className={styles.glowLight}></div>

      <div className="container">
        <div className={styles.grid}>
          {/* Left Side: Contact Information */}
          <div className={styles.infoCol}>
            <span className={styles.tagline}>FALE CONOSCO</span>
            <h2 className={styles.title}>Pronto para Iniciar?</h2>
            <p className={styles.desc}>
              Preencha o formulário para falar com um especialista em IA da ZYND. Entraremos em contato para agendar um diagnóstico de processos sem custo.
            </p>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <Mail size={18} />
                </div>
                <div>
                  <span className={styles.detailLabel}>E-mail</span>
                  <a href="mailto:contato@zynd.ai" className={styles.detailValue}>contato@zynd.ai</a>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <Phone size={18} />
                </div>
                <div>
                  <span className={styles.detailLabel}>Telefone</span>
                  <a href="tel:+5511999999999" className={styles.detailValue}>+55 (11) 99999-9999</a>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconCircle}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <span className={styles.detailLabel}>WhatsApp</span>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className={styles.detailValue}>Conversar no WhatsApp</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Container */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className={styles.form}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    noValidate
                  >
                    {/* Name */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="name" className={styles.label}>Nome Completo *</label>
                      <div className={`${styles.inputWrapper} ${errors.name ? styles.inputErrorGlow : ""}`}>
                        <User size={16} className={styles.fieldIcon} />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={fields.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={styles.input}
                          placeholder="Digite seu nome"
                        />
                      </div>
                      {errors.name && touched.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.label}>E-mail Corporativo *</label>
                      <div className={`${styles.inputWrapper} ${errors.email ? styles.inputErrorGlow : ""}`}>
                        <Mail size={16} className={styles.fieldIcon} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={fields.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={styles.input}
                          placeholder="exemplo@suaempresa.com"
                        />
                      </div>
                      {errors.email && touched.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.row}>
                      {/* Phone */}
                      <div className={styles.inputGroup}>
                        <label htmlFor="phone" className={styles.label}>Telefone *</label>
                        <div className={`${styles.inputWrapper} ${errors.phone ? styles.inputErrorGlow : ""}`}>
                          <Phone size={16} className={styles.fieldIcon} />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={fields.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={styles.input}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                        {errors.phone && touched.phone && <span className={styles.errorText}>{errors.phone}</span>}
                      </div>

                      {/* Company */}
                      <div className={styles.inputGroup}>
                        <label htmlFor="company" className={styles.label}>Empresa</label>
                        <div className={styles.inputWrapper}>
                          <User size={16} className={styles.fieldIcon} />
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={fields.company}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Nome da empresa"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="message" className={styles.label}>Mensagem *</label>
                      <div className={`${styles.inputWrapper} ${errors.message ? styles.inputErrorGlow : ""}`}>
                        <MessageSquare size={16} className={`${styles.fieldIcon} ${styles.areaIcon}`} />
                        <textarea
                          id="message"
                          name="message"
                          value={fields.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={styles.textarea}
                          placeholder="Como podemos te ajudar?"
                          rows={4}
                        />
                      </div>
                      {errors.message && touched.message && <span className={styles.errorText}>{errors.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.submitBtn}
                    >
                      {isSubmitting ? (
                        <div className={styles.spinner}></div>
                      ) : (
                        <>
                          Enviar Mensagem <Send size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className={styles.successCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 size={54} className={styles.successIcon} />
                    <h3 className={styles.successTitle}>Mensagem Enviada!</h3>
                    <p className={styles.successDesc}>
                      Tudo certo! Recebemos sua mensagem e entraremos em contato nas próximas horas. Agradecemos o interesse pela ZYND.
                    </p>
                    <button onClick={() => setIsSubmitted(false)} className={styles.backBtn}>
                      Enviar Novo Formulário
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
