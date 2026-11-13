"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { FormField } from "@/components/admin/forms/form-field";
import { ImageUpload } from "@/components/admin/forms/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettingsAction } from "@/features/settings/actions";
import type { SiteSettingsBundle } from "@/features/settings/schemas";

interface SettingsManagerProps {
  readonly initialSettings: SiteSettingsBundle;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettingsBundle>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await saveSiteSettingsAction(settings);
      setFeedback({
        type: result.ok ? "ok" : "error",
        text: result.ok
          ? (result.message ?? "Settings saved.")
          : (result.error ?? "Unable to save settings."),
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {feedback ? (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={
            feedback.type === "error"
              ? "flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              : "flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
          }
        >
          {feedback.type === "error" ? (
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </div>
      ) : null}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Platform Identity</CardTitle>
              <CardDescription>
                Core public branding and primary editorial contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="set-site-name" label="Site Name" required>
                  <Input
                    id="set-site-name"
                    value={settings.general.site_name}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        general: { ...s.general, site_name: e.target.value },
                      }))
                    }
                    required
                  />
                </FormField>

                <FormField id="set-tagline" label="Tagline" required>
                  <Input
                    id="set-tagline"
                    value={settings.general.tagline}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        general: { ...s.general, tagline: e.target.value },
                      }))
                    }
                    required
                  />
                </FormField>
              </div>

              <FormField id="set-description" label="Platform Description" required>
                <Textarea
                  id="set-description"
                  rows={3}
                  value={settings.general.description}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      general: { ...s.general, description: e.target.value },
                    }))
                  }
                  required
                />
              </FormField>

              <FormField id="set-contact-email" label="Public Contact Email">
                <Input
                  id="set-contact-email"
                  type="email"
                  value={settings.general.contact_email}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      general: { ...s.general, contact_email: e.target.value },
                    }))
                  }
                  placeholder="hello@thelivingearth.org"
                />
              </FormField>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Social Channels</CardTitle>
              <CardDescription>
                Public links displayed across navigation and editorial footers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField id="set-instagram" label="Instagram URL">
                <Input
                  id="set-instagram"
                  type="url"
                  value={settings.social_media.instagram_url}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      social_media: { ...s.social_media, instagram_url: e.target.value },
                    }))
                  }
                  placeholder="https://instagram.com/..."
                />
              </FormField>

              <FormField id="set-youtube" label="YouTube URL">
                <Input
                  id="set-youtube"
                  type="url"
                  value={settings.social_media.youtube_url}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      social_media: { ...s.social_media, youtube_url: e.target.value },
                    }))
                  }
                  placeholder="https://youtube.com/..."
                />
              </FormField>

              <FormField id="set-x" label="X / Twitter URL">
                <Input
                  id="set-x"
                  type="url"
                  value={settings.social_media.x_url}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      social_media: { ...s.social_media, x_url: e.target.value },
                    }))
                  }
                  placeholder="https://x.com/..."
                />
              </FormField>

              <FormField id="set-linkedin" label="LinkedIn URL">
                <Input
                  id="set-linkedin"
                  type="url"
                  value={settings.social_media.linkedin_url}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      social_media: { ...s.social_media, linkedin_url: e.target.value },
                    }))
                  }
                  placeholder="https://linkedin.com/..."
                />
              </FormField>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">SEO &amp; Social Sharing Defaults</CardTitle>
              <CardDescription>
                Fallback metadata used on public storytelling pages when page-specific SEO is unset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="set-seo-title" label="Default SEO Title" required>
                <Input
                  id="set-seo-title"
                  maxLength={160}
                  value={settings.seo_defaults.default_title}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      seo_defaults: { ...s.seo_defaults, default_title: e.target.value },
                    }))
                  }
                  required
                />
              </FormField>

              <FormField id="set-seo-desc" label="Default SEO Description" required>
                <Textarea
                  id="set-seo-desc"
                  rows={3}
                  maxLength={320}
                  value={settings.seo_defaults.default_description}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      seo_defaults: { ...s.seo_defaults, default_description: e.target.value },
                    }))
                  }
                  required
                />
              </FormField>

              <FormField id="set-og-image" label="Default Social Share Image (site-assets)">
                <ImageUpload
                  id="set-og-image"
                  bucket="site-assets"
                  value={settings.seo_defaults.og_image_path}
                  onChange={(next) =>
                    setSettings((s) => ({
                      ...s,
                      seo_defaults: { ...s.seo_defaults, og_image_path: next },
                    }))
                  }
                  disabled={isPending}
                />
              </FormField>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Footer Copy</CardTitle>
              <CardDescription>
                Editorial mission note and attribution statements rendered in the public footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField id="set-mission" label="Mission Statement" required>
                <Textarea
                  id="set-mission"
                  rows={3}
                  value={settings.footer.mission_statement}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      footer: { ...s.footer, mission_statement: e.target.value },
                    }))
                  }
                  required
                />
              </FormField>

              <FormField id="set-methodology" label="Scientific Transparency Note">
                <Textarea
                  id="set-methodology"
                  rows={2}
                  value={settings.footer.methodology_note}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      footer: { ...s.footer, methodology_note: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField id="set-copyright" label="Copyright Text" required>
                <Input
                  id="set-copyright"
                  value={settings.footer.copyright_text}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      footer: { ...s.footer, copyright_text: e.target.value },
                    }))
                  }
                  required
                />
              </FormField>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          <span>{isPending ? "Saving..." : "Save All Settings"}</span>
        </Button>
      </div>
    </form>
  );
}
