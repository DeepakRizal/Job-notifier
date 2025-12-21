"use client";

import { fetchAJob } from "@/lib/queries/jobs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import ArcLoader from "../../layout/ArcLoader";
import Link from "next/link";

interface JobDetailsProps {
  jobId: string;
}

export function JobDetailPanel({ jobId }: JobDetailsProps) {
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchAJob(jobId),
  });

  if (isLoading) return <ArcLoader />;

  if (error || !job) {
    return (
      <section className="px-6 py-10">
        <p className="text-sm font-medium text-muted-foreground">
          Failed to load job details
        </p>
      </section>
    );
  }

  const postedDate = job.postedAt
    ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
    : null;

  const experienceText = job.experience
    ? job.experience.min === job.experience.max
      ? `${job.experience.min} years`
      : `${job.experience.min}-${job.experience.max} years`
    : null;

  return (
    <section className="px-6 py-8">
      {/* LEFT-ALIGNED CONTENT WRAPPER */}
      <div className="max-w-6xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Header */}
            <header className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Briefcase className="h-4 w-4" />
                  {job.company}
                </div>

                {job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                )}

                {experienceText && (
                  <span className="font-medium">
                    {experienceText} experience
                  </span>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {postedDate && <>Posted {postedDate}</>}
                {job.source && <> · via {job.source}</>}
              </div>
            </header>

            {/* Description */}
            {job.description && (
              <section className="border-t pt-6">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Job Description
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {job.description}
                </p>
              </section>
            )}

            {/* Skills */}
            {job.tags?.length > 0 && (
              <section className="border-t pt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN (STICKY ACTIONS) */}
          <aside className="h-fit rounded-xl border p-5 lg:sticky lg:top-24">
            <div className="space-y-3">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent">
                <Bookmark className="h-4 w-4" />
                Save Job
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
