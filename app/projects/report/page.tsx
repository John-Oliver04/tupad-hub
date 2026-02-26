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

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/projects")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ADL or Municipality"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
          />
        </div>
        <button onClick={() => window.print()} className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800">PDF</button>
      </div>

      {/* <h1 className="mb-4 text-xl font-semibold text-zinc-900">TUPAD Projects Report</h1> */}

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-700">No projects match the search.</p>
      )}

      {filtered.map((p, idx) => {
        const pre = p.preDetails || {};
        const post = p.postDetails || {};
        return (
          <div key={p.id} className={` rounded-lg border border-zinc-200 bg-white p-4 ${idx > 0 ? "page-break" : ""}`}>
            <div className=" flex items-center justify-between">
              <div className="w-full">
                <h2 className="text-lg font-semibold text-zinc-800 text-center">ADL {p.adl}</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              
                <div className=" border overflow-hidden border-blue-300 border-l-4 border-l-blue-500">
                  <SectionHeading>Project Information</SectionHeading>
                  <Table>
                    <tbody>
                      <tr><TH>Name & Nature</TH><TD>{pre.projectInformation?.nameNature || ""}</TD></tr>
                      <tr><TH>Proponent</TH><TD>{pre.projectInformation?.proponent || ""}</TD></tr>
                      <tr><TH>Location</TH><TD>{pre.projectInformation?.location || ""}</TD></tr>
                      <tr><TH>Total Beneficiaries</TH><TD>{pre.projectInformation?.totalBeneficiaries ?? p.beneficiaries ?? ""} / {post.verification?.totalBeneficiariesActual || ""}</TD></tr>
                      <tr><TH>Total Female</TH><TD>{pre.projectInformation?.totalFemale ?? ""}</TD></tr>
                      <tr><TH>No. of Days</TH><TD>{pre.projectInformation?.noOfDays ?? ""}</TD></tr>
                    </tbody>
                  </Table>
                </div>
              <div className="border overflow-hidden border-yellow-300 border-l-4 border-l-yellow-500">
                <SectionHeading>PRE • Document Tracking</SectionHeading>
                <Table>
                  <tbody>
                    <tr><TH>Date Received (RO)</TH><TD>{pre.documentTracking?.dateReceivedRO || ""}</TD></tr>
                    <tr><TH>Date Submitted (RO)</TH><TD>{pre.documentTracking?.dateSubmittedRO || ""}</TD></tr>
                    <tr><TH>Notice to Proceed</TH><TD>{pre.documentTracking?.noticeToProceedDate || ""}</TD></tr>
                  </tbody>
                </Table>
                <div className="">
                  <SectionHeading>PRE • Implementation</SectionHeading>
                  <Table>
                    <tbody>
                      <tr><TH>Orientation Date</TH><TD>{pre.implementation?.orientationDate || ""}</TD></tr>
                      <tr><TH>Remarks</TH><TD>{pre.implementation?.remarks || ""}</TD></tr>
                    </tbody>
                  </Table>
                </div>
              </div>


              <div className=" border overflow-hidden border-green-300 border-l-4 border-l-green-500">
                <div className="mt-1">
                  <SectionHeading>POST • Implementation Summary</SectionHeading>
                  <Table>
                    <tbody>
                      <tr><TH>Payment Released</TH><TD>{post.implementation?.paymentReleasedDate || ""}</TD></tr>
                    </tbody>
                  </Table>
                </div>
                <div className="">
                  <SectionHeading>POST • Document Tracking</SectionHeading>
                  <Table>
                    <tbody>
                      <tr><TH>Date Received (Post)</TH><TD>{post.documentTracking?.dateReceivedPost || ""}</TD></tr>
                      <tr><TH>Submitted to RO</TH><TD>{post.documentTracking?.dateSubmittedRO || ""}</TD></tr>
                    </tbody>
                  </Table>
                </div>
                <div className="">
                  <SectionHeading>POST • Verification</SectionHeading>
                  <Table>
                    <tbody>
                      <tr><TH>Total Beneficiaries (Actual)</TH><TD>{post.verification?.totalBeneficiariesActual ?? ""}</TD></tr>
                      <tr><TH>Total Female (Actual)</TH><TD>{post.verification?.totalFemaleActual ?? ""}</TD></tr>
                      <tr><TH>No. of Days of Work</TH><TD>{post.verification?.noOfDaysOfWork ?? ""}</TD></tr>
                      <tr><TH>Implementation Period</TH><TD>{(post.verification?.periodStart || "") + (post.verification?.periodEnd ? ` - ${post.verification?.periodEnd}` : "")}</TD></tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

