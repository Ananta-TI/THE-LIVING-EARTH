"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/config/site";
import { contactSubmissionSchema } from "@/features/contact/schemas";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const payload = {
      name,
      email,
      subject,
      message,
      website,
    };

    const clientCheck = contactSubmissionSchema.safeParse(payload);
    if (!clientCheck.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of clientCheck.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setFormError(
        clientCheck.error.issues[0]?.message ?? "Please review the highlighted fields.",
      );
      return;
    }

    setFieldErrors({});

    // Honeypot trap: silently accept submissions from automated bots.
    if (website.trim().length > 0) {
      setSuccessMessage("Thank you for reaching out.");
      return;
    }

    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");
    const mailtoUrl = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
      subject.trim(),
    )}&body=${encodeURIComponent(body)}`;

    setSuccessMessage(
      `Your email app should open with your message ready to send. If it does not, write directly to ${SITE_CONFIG.contactEmail}.`,
    );
    window.location.href = mailtoUrl;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Send a message to THE LIVING EARTH"
      className="border-t border-border pt-6"
    >
      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 flex items-start gap-3 border-l-2 border-primary pl-4 text-sm text-foreground"
        >
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Email draft ready</p>
            <p className="mt-1 text-muted-foreground">{successMessage}</p>
          </div>
        </div>
      ) : null}

      {formError ? (
        <div
          role="alert"
          className="mb-8 flex items-start gap-3 border-l-2 border-destructive pl-4 text-sm text-foreground"
        >
          <AlertCircle
            className="mt-0.5 size-5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-destructive">Please review your message</p>
            <p className="mt-1 text-muted-foreground">{formError}</p>
          </div>
        </div>
      ) : null}

      {/* Hidden honeypot field for automated spam filtering */}
      <div className="sr-only" aria-hidden="true">
        <Label htmlFor="contact-website">Leave this field blank</Label>
        <Input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="contact-name"
            className="font-mono text-[10px] tracking-[0.12em] text-earth-muted"
          >
            NAME <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            placeholder="Your full name"
            className="h-11 rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0"
          />
          {fieldErrors.name ? (
            <p id="contact-name-error" className="text-xs font-medium text-destructive">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="contact-email"
            className="font-mono text-[10px] tracking-[0.12em] text-earth-muted"
          >
            EMAIL <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            placeholder="you@example.org"
            className="h-11 rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0"
          />
          {fieldErrors.email ? (
            <p id="contact-email-error" className="text-xs font-medium text-destructive">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="contact-subject"
          className="font-mono text-[10px] tracking-[0.12em] text-earth-muted"
        >
          SUBJECT <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
          placeholder="Topic, story question, or scientific source inquiry"
          className="h-11 rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0"
        />
        {fieldErrors.subject ? (
          <p id="contact-subject-error" className="text-xs font-medium text-destructive">
            {fieldErrors.subject}
          </p>
        ) : null}
      </div>

      <div className="space-y-2 pt-2">
        <Label
          htmlFor="contact-message"
          className="font-mono text-[10px] tracking-[0.12em] text-earth-muted"
        >
          MESSAGE <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : "contact-message-hint"
          }
          placeholder="Share your inquiry, feedback, or environmental documentation note..."
          className="min-h-36 rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0"
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" className="text-xs font-medium text-destructive">
            {fieldErrors.message}
          </p>
        ) : (
          <p id="contact-message-hint" className="text-xs text-muted-foreground">
            Minimum 10 characters. Include citation details if suggesting a scientific correction.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="max-w-[46ch] text-xs leading-relaxed text-muted-foreground">
          This form opens your own email app — nothing is stored on this website.
        </p>
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 rounded-none bg-foreground px-6 text-background transition-colors duration-200 hover:bg-primary active:scale-[0.98]"
        >
          <Send className="size-4" aria-hidden="true" />
          <span>Open email draft</span>
        </Button>
      </div>
    </form>
  );
}
