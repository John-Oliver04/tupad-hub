"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../../../utils/storage";
import { Project } from "../../../../utils/types";

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="font-medium text-zinc-700">{label}</div>
      <div className="text-zinc-900">{value ?? "—"}</div>
    </div>
  );
}

export default function ProjectReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [projects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-4 flex items-center justify-between no-print">
          <button onClick={() => router.push("/projects")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
        </div>
        <p className="text-sm text-zinc-700">Project not found.</p>
      </div>
    );
  }

  const pre = project.preDetails || {};
  const post = project.postDetails || {};

  const currency = (n?: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(n || 0);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between no-print">
        <button onClick={() => router.push(`/projects/${project.id}`)} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
        <button onClick={() => window.print()} className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800">Print PDF</button>
      </div>

      <div className="space-y-3 bg-white ">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 text-center">TUPAD Project Report</h1>
          <div className="mt-1 text-sm text-zinc-600 text-center">ADL {project.adl} • {project.municipality}</div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800">PRE EMPLOYMENT DETAILS</h2>
          <div className="grid gap-4">
            
            <div className="rounded-lg border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Project Information</h3>
              <div className="space-y-1">
                <Row label="Name & Nature of Project" value={pre.projectInformation?.nameNature || ""} />
                <Row label="Name of Proponent" value={pre.projectInformation?.proponent || ""} />
                <Row label="Project Location" value={pre.projectInformation?.location || ""} />
                <Row label="Total Beneficiaries" value={pre.projectInformation?.totalBeneficiaries ?? project.beneficiaries ?? "" } />
                <Row label="Total Female" value={pre.projectInformation?.totalFemale ?? ""} />
                <Row label="No. of Days" value={pre.projectInformation?.noOfDays ?? ""} />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Document Tracking</h3>
              <div className="space-y-1">
                <Row label="Date Received from Regional Office" value={pre.documentTracking?.dateReceivedRO || ""} />
                <Row label="Date Submitted to Regional Office" value={pre.documentTracking?.dateSubmittedRO || ""} />
                <Row label="Notice to Proceed (Date)" value={pre.documentTracking?.noticeToProceedDate || ""} />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Implementation</h3>
              <div className="space-y-1">
                <Row label="Orientation Date" value={pre.implementation?.orientationDate || ""} />
                <Row label="Implementation Period (Start - End)" value={(post.verification?.periodStart || "") + (post.verification?.periodEnd ? ` - ${post.verification?.periodEnd}` : "")} />
                <Row label="Payment of Wages (Date)" value={pre.implementation?.paymentDate || ""} />
                <Row label="Remarks" value={pre.implementation?.remarks || ""} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800">POST EMPLOYMENT DETAILS</h2>
          <div className="grid gap-4">
            
            <div className="rounded-lg border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Project Verification</h3>
              <div className="space-y-1">
                <Row label="Total Beneficiaries (Actual Signed)" value={post.verification?.totalBeneficiariesActual ?? ""} />
                <Row label="Total Female (Actual Signed)" value={post.verification?.totalFemaleActual ?? ""} />
                <Row label="No. of Days of Work" value={post.verification?.noOfDaysOfWork ?? ""} />
               </div>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Document Tracking</h3>
              <div className="space-y-1">
                <Row label="Date Received of Post Employment" value={post.documentTracking?.dateReceivedPost || ""} />
                <Row label="Submitted to Regional Office (Date)" value={post.documentTracking?.dateSubmittedRO || ""} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

