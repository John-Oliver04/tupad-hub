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
      <div className="mx-auto max-w-3xl p-4 mb-5">
        <div className="mb-4 flex items-center justify-between no-print">
          <button onClick={() => router.push("/projects")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
        </div>
        <p className="text-sm text-zinc-700">Project not found.</p>
      </div>
    );
  }

  const pre = project.preDetails || {};
  const post = project.postDetails || {};

  function PrintTable({ rows }: { rows: [string, any][] }) {
    return (
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map(([label, value], index) => (
            <tr key={index}>
              <td className="border border-black p-2 font-medium w-1/3">
                {label}
              </td>
              <td className="border border-black p-2">
                {value || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // currency formatting not used in this report version; keep lean

  return (
    <div className="mx-auto max-w-3xl p-4 mb-5">
      <div className="mb-4 flex items-center justify-between no-print">
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-md bg-green-700 px-3 py-1.5 text-sm text-white hover:bg-green-800"
        >
          Print PDF
        </button>
      </div>

      <div className="bg-white p-8 print:p-6">

        {/* HEADER */}
        <div className="text-center border-b border-black pb-4 mb-6">
          <h1 className="text-xl font-bold tracking-wide">
            TUPAD PROJECT REPORT
          </h1>
          <p className="text-sm mt-1">
            ADL {project.adl} • {project.municipality}
          </p>
        </div>

        {/* PRE EMPLOYMENT */}
        <section className="mb-8">
          <h2 className="text-sm font-bold border-b border-black pb-1 mb-4">
            PRE-EMPLOYMENT DETAILS
          </h2>

          <PrintTable
            rows={[
              ["Name & Nature of Project", pre.projectInformation?.nameNature],
              ["Name of Proponent", pre.projectInformation?.proponent],
              ["Project Location", pre.projectInformation?.location],
              ["Total Beneficiaries", pre.projectInformation?.totalBeneficiaries ?? project.beneficiaries],
              ["Total Female", pre.projectInformation?.totalFemale],
              ["No. of Days", pre.projectInformation?.noOfDays],
              ["Date Received (RO)", pre.documentTracking?.dateReceivedRO],
              ["Date Submitted (RO)", pre.documentTracking?.dateSubmittedRO],
              ["Notice to Proceed", pre.documentTracking?.noticeToProceedDate],
              ["Orientation Date", pre.implementation?.orientationDate],
              ["Implementation Period",
                (post.verification?.periodStart || "") +
                  (post.verification?.periodEnd
                    ? ` - ${post.verification?.periodEnd}`
                    : "")
              ],
              ["Payment of Wages", pre.implementation?.paymentDate],
              ["Remarks", pre.implementation?.remarks],
            ]}
          />
        </section>

        {/* POST EMPLOYMENT */}
        <section>
          <h2 className="text-sm font-bold border-b border-black pb-1 mb-4">
            POST-EMPLOYMENT DETAILS
          </h2>

          <PrintTable
            rows={[
              ["Total Beneficiaries (Actual)", post.verification?.totalBeneficiariesActual],
              ["Total Female (Actual)", post.verification?.totalFemaleActual],
              ["No. of Days of Work", post.verification?.noOfDaysOfWork],
              ["Date Received (Post)", post.documentTracking?.dateReceivedPost],
              ["Submitted to RO", post.documentTracking?.dateSubmittedRO],
            ]}
          />
        </section>

      </div>
    </div>
  );
}
