"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../../utils/storage";
import { Project } from "../../../utils/types";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-sm text-center font-semibold text-zinc-700 px-2 py-1">{children}</h3>;
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-sm">
      {children}
    </table>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return <th className="border border-zinc-300 bg-zinc-100 p-2 text-left text-zinc-800">{children}</th>;
}
function TD({ children }: { children: React.ReactNode }) {
  return <td className="border border-zinc-300 p-2 text-zinc-800">{children}</td>;
}

export default function AllProjectsReportPage() {
  const router = useRouter();
  const [projects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.adl, p.municipality].some((s) => s?.toLowerCase().includes(q))
    );
  }, [projects, query]);

  // no currency formatting needed in table view
  function PrintTable({ rows }: { rows: [string, any][] }) {
    return (
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i}>
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
  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/projects")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
          {/* <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ADL or Municipality"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
          /> */}
        </div>
        <button onClick={() => window.print()} className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800">Print</button>
      </div>

      {/* <h1 className="mb-4 text-xl font-semibold text-zinc-900">TUPAD Projects Report</h1> */}

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-700">No projects match the search.</p>
      )}

      {filtered.map((p, idx) => {
        const pre = p.preDetails || {};
        const post = p.postDetails || {};
        return (
          <div
            key={p.id}
            className={`bg-white p-8 print:p-6 ${idx > 0 ? "page-break" : ""}`}
          >
            {/* HEADER */}
            <div className="text-center border-b border-black pb-4 mb-6">
              <h1 className="text-xl font-bold tracking-wide">
                TUPAD PROJECT REPORT
              </h1>
              <p className="text-sm mt-1">
                ADL {p.adl} • {p.municipality}
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
                  ["Proponent", pre.projectInformation?.proponent],
                  ["Location", pre.projectInformation?.location],
                  ["Total Beneficiaries", pre.projectInformation?.totalBeneficiaries ?? p.beneficiaries],
                  ["Total Female", pre.projectInformation?.totalFemale],
                  ["No. of Days", pre.projectInformation?.noOfDays],
                  ["Date Received (RO)", pre.documentTracking?.dateReceivedRO],
                  ["Date Submitted (RO)", pre.documentTracking?.dateSubmittedRO],
                  ["Notice to Proceed", pre.documentTracking?.noticeToProceedDate],
                  ["Orientation Date", pre.implementation?.orientationDate],
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
                  ["Payment Released", post.implementation?.paymentReleasedDate],
                  ["Date Received (Post)", post.documentTracking?.dateReceivedPost],
                  ["Submitted to RO", post.documentTracking?.dateSubmittedRO],
                  ["Total Beneficiaries (Actual)", post.verification?.totalBeneficiariesActual],
                  ["Total Female (Actual)", post.verification?.totalFemaleActual],
                  ["No. of Days of Work", post.verification?.noOfDaysOfWork],
                  [
                    "Implementation Period",
                    (post.verification?.periodStart || "") +
                      (post.verification?.periodEnd
                        ? ` - ${post.verification?.periodEnd}`
                        : ""),
                  ],
                ]}
              />
            </section>
          </div>
        );
      })}
    </div>
  );
}

