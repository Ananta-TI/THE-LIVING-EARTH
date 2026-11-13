"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactAction } from "@/features/contact/actions";
import { contactSubmissionSchema } from "@/features/contact/schemas";

export function ContactForm() {
  const [renderedAt] = useState<number>(() => Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const payload = {
      name,
      email,
      subject,
      message,
      website,
      renderedAt,
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
    setIsSubmitting(true);

    try {
      const result = await submitContactAction(payload);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(
          result.error ??
            "Unable to submit your message right now. Your input has been preserved.",
        );
        return;
      }

      setSuccessMessage(
        result.message ??
          "Thank you for reaching out. Your message has been sent to THE LIVING EARTH editorial desk.",
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setWebsite("");
      setFieldErrors({});
    } catch {
      setFormError(
        "A network issue prevented submission. Your input has been preserved—please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Send a message to THE LIVING EARTH"
      className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/8 p-4 text-sm text-foreground"
        >
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Message delivered</p>
            <p className="mt-1 text-muted-foreground">{successMessage}</p>
          </div>
        </div>
      ) : null}

      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/35 bg-destructive/8 p-4 text-sm text-foreground"
        >
          <AlertCircle
            className="mt-0.5 size-5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-destructive">Unable to send message</p>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Name <span className="text-destructive" aria-hidden="true">*</span>
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
            className="h-11 bg-background"
          />
          {fieldErrors.name ? (
            <p id="contact-name-error" className="text-xs font-medium text-destructive">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email <span className="text-destructive" aria-hidden="true">*</span>
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
            className="h-11 bg-background"
          />
          {fieldErrors.email ? (
            <p id="contact-email-error" className="text-xs font-medium text-destructive">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          Subject <span className="text-destructive" aria-hidden="true">*</span>
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
          className="h-11 bg-background"
        />
        {fieldErrors.subject ? (
          <p id="contact-subject-error" className="text-xs font-medium text-destructive">
            {fieldErrors.subject}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">
          Message <span className="text-destructive" aria-hidden="true">*</span>
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
          className="min-h-36 bg-background"
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" className="text-xs font-medium text-destructive">
            {fieldErrors.message}
          </p>
        ) : (
          <p id="contact-message-hint" className="text-xs text-muted-foreground">
            Minimum 10 characters. Please include citation details if suggesting a scientific correction.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <p className="text-xs text-muted-foreground">
          Submitted inquiries are reviewed only by authorized platform editors.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 gap-2 px-6">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Sending message...</span>
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              <span>Submit Message</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
