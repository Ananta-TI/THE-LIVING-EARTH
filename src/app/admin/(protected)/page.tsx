import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  FileText,
  Globe2,
  Images,
  Inbox,
  Plus,
} from "lucide-react";
import { ContentDistributionChart } from "@/components/admin/dashboard/content-distribution-chart";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/features/dashboard/queries";
import { formatDateTime } from "@/lib/utils/format";

export default async function AdminDashboardPage() {
  const result = await getDashboardData();

  if (!result.ok) {
    return (
      <div>
        <PageHeader
          title="Editorial Dashboard"
          description="Live platform metrics, recent submissions, and publishing coverage."
        />
        <ErrorState message={result.error} />
      </div>
    );
  }

  const { metrics, recentArticles, recentMessages, pillarDistribution } = result.data;

  const primaryCards = [
    {
      label: "Total Articles",
      value: metrics.totalArticles,
      detail: "All editorial articles",
      href: "/admin/articles",
      icon: FileText,
    },
    {
      label: "Published",
      value: metrics.publishedArticles,
      detail: "Live on public website",
      href: "/admin/articles?status=published",
      icon: BookOpen,
    },
    {
      label: "Drafts",
      value: metrics.draftArticles,
      detail: "In editorial review",
      href: "/admin/articles?status=draft",
      icon: Plus,
    },
    {
      label: "Case Studies",
      value: metrics.totalCaseStudies,
      detail: "Field & regional reports",
      href: "/admin/case-studies",
      icon: Globe2,
    },
  ];

  const secondaryCards = [
    {
      label: "Published Statistics",
      value: metrics.publishedStatistics,
      href: "/admin/statistics",
      icon: BarChart3,
    },
    {
      label: "Scientific References",
      value: metrics.totalReferences,
      href: "/admin/references",
      icon: BookOpen,
    },
    {
      label: "Unread Messages",
      value: metrics.unreadMessages,
      href: "/admin/messages",
      icon: Inbox,
    },
    {
      label: "Media Assets",
      value: metrics.totalMediaAssets,
      href: "/admin/media",
      icon: Images,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Manage your environmental content and monitor platform activity across THE LIVING EARTH."
        actions={
          <>
            <Button asChild size="sm" className="gap-1.5 rounded-full px-4">
              <Link href="/admin/articles/create">
                <Plus className="size-4" aria-hidden="true" />
                <span>New Article</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-full px-4">
              <Link href="/admin/statistics/create">
                <Plus className="size-4" aria-hidden="true" />
                <span>New Statistic</span>
              </Link>
            </Button>
          </>
        }
      />

      <section aria-label="Primary content metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Card className="h-full rounded-2xl border-border bg-card shadow-2xs transition-colors group-hover:border-primary/45">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {card.label}
                  </CardDescription>
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-4xl font-medium text-foreground tabular-nums">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section aria-label="Supporting platform counters" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
              <span className="font-heading text-lg font-medium text-foreground tabular-nums">
                {item.value}
              </span>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="rounded-2xl lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Content Overview</CardTitle>
            <CardDescription>
              Published and active coverage across the five environmental pillars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentDistributionChart data={pillarDistribution} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Quick Actions</CardTitle>
            <CardDescription>Jump directly to primary editorial workflows.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5">
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5">
              <Link href="/admin/articles/create">
                <FileText className="size-4 text-primary" aria-hidden="true" />
                <span>Draft a New Editorial Article</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5">
              <Link href="/admin/case-studies/create">
                <Globe2 className="size-4 text-primary" aria-hidden="true" />
                <span>Document a Regional Case Study</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5">
              <Link href="/admin/statistics/create">
                <BarChart3 className="size-4 text-primary" aria-hidden="true" />
                <span>Add a Verified Environmental Statistic</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5">
              <Link href="/admin/references/create">
                <BookOpen className="size-4 text-primary" aria-hidden="true" />
                <span>Register a Scientific Reference</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5">
              <Link href="/admin/media">
                <Images className="size-4 text-primary" aria-hidden="true" />
                <span>Upload &amp; Organize Media Library</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="font-heading text-xl">Recent Articles</CardTitle>
              <CardDescription>Latest stories updated in the CMS.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/articles">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                No articles have been created yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentArticles.map((article) => (
                  <li key={article.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {article.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {article.pillar_name} · Updated {formatDateTime(article.updated_at)}
                      </p>
                    </div>
                    <StatusBadge status={article.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="font-heading text-xl">Recent Contact Messages</CardTitle>
              <CardDescription>Incoming reader inquiries and data feedback.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/messages">Open inbox</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">
                No contact submissions received yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentMessages.map((msg) => (
                  <li key={msg.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/messages/${msg.id}`}
                        className="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {msg.subject}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        From {msg.name} · {formatDateTime(msg.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={msg.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
