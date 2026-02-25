"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Modal from "../../components/Modal";
import { FadeInUp } from "../../components/Motion";
import { FolderIcon, ArrowRightIcon, PlusIcon, PrintIcon } from "../../components/Icons";
import { FormInput } from "../../components/FormInput";
import useLocalStorage from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../utils/storage";
import { Project, ProjectStatus } from "../../utils/types";

type Draft = {
  adl: string;
  beneficiaries: number;
  municipality: string;
};

const newDraft = (): Draft => ({ adl: "", beneficiaries: 0, municipality: "" });

export default function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const [draft, setDraft] = useState<Draft>(newDraft());
  const [_search, _setSearch] = useState("");
  const [_filterMunicipality, _setFilterMunicipality] = useState("");
  const [_statusFilter, _setStatusFilter] = useState<ProjectStatus | "">("");

  const add = () => {
    if (!draft.adl || !draft.municipality) return;
    const id = crypto.randomUUID();
    setProjects([
      ...projects,
      { id, adl: draft.adl.trim(), beneficiaries: Number(draft.beneficiaries || 0), municipality: draft.municipality.trim(), status: "Pending", preDetails: {}, postDetails: {} } as Project,
    ]);
    setDraft(newDraft());
  };

  const remove = (id: string) => setProjects(projects.filter((p) => p.id !== id));

  const filtered = useMemo(() => {
    return projects;
  }, [projects]);

  const _municipalities = Array.from(new Set(projects.map((p) => p.municipality))).sort();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tupad-projects.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const [openCreate, setOpenCreate] = useState(false);
  const openNew = () => {
    setDraft(newDraft());
    setOpenCreate(true);
  };

  const summarize = (proj: Project) => {
    const pre = proj.preDetails || {};
    const post = proj.postDetails || {};
    const adl = pre.documentTracking?.adlNumber || proj.adl || "—";
    const beneficiaries =   pre.projectInformation?.totalBeneficiaries ?? proj.beneficiaries ?? "—";
    const postBeneficiaries =  post.verification?.totalBeneficiariesActual ??  proj.beneficiaries ?? "—";
    const female = post.verification?.totalFemaleActual ?? pre.projectInformation?.totalFemale ?? "—";
    const ntpNumber = pre.documentTracking?.ntpNumber || "—";
    const ntpDate = pre.documentTracking?.noticeToProceedDate || "—";
    const periodStart = post.verification?.periodStart || "";
    const periodEnd = post.verification?.periodEnd || "";
    const period = periodStart ? `${periodStart}${periodEnd ? ` - ${periodEnd}` : ""}` : "—";
    const preSubmitted = pre.documentTracking?.dateSubmittedRO || "—";
    const postSubmitted = post.documentTracking?.dateSubmittedRO || "—";
    return { adl, beneficiaries, postBeneficiaries, female, ntpNumber, ntpDate, period, preSubmitted, postSubmitted };
  };

  return (
    <div className="grid gap-4 relative">
      <h2 className="text-lg font-semibold text-zinc-800">Projects</h2>
      <Link
        href="/projects/report"
        aria-label="Print all projects"
        className="fixed right-1 top-15 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-green-400 text-zinc-800 shadow hover:bg-green-600"
        title="Print All"
      >
        <PrintIcon />
      </Link>

      {/* Filters hidden as requested */}
      <div className="hidden" />

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((p) => {
          const s = summarize(p);
          const headBg = p.status === "Completed" ? "bg-green-50 text-green-900" : "bg-blue-50 text-blue-900";
          return (
            <FadeInUp key={p.id}>
              <details className="mb-2" open={false}>
                <summary className={`flex cursor-pointer list-none items-center justify-between rounded-md px-4 py-3 text-sm font-semibold ${headBg} border border-zinc-200`}>
                  <span className="flex items-center gap-2">
                    <FolderIcon /> 
                    <span>ADL {s.adl} • {p.municipality} • {s.beneficiaries}/{s.postBeneficiaries} Ben.</span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {p.status || "Pending"}
                  </span>
                </summary>
                <div className="accordion-content border border-t-0 border-zinc-200 p-4 bg-white">
                  <div className="mb-3 flex items-center justify-end gap-2">
                    <Link className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700" href={`/projects/${p.id}`}>
                      Open <ArrowRightIcon />
                    </Link>

                  </div>
                  <div className="text-sm text-zinc-700">
                    <p><span className="font-bold">Nature of Project:</span> {p.natureOfProject || p.preDetails?.projectInformation?.nameNature || "N/A"}</p>
                    <p><span className="font-bold">Municipality:</span> {p.municipality}</p>
                    <div className="mt-2 grid gap-1 sm:grid-cols-2">
                      <p><span className="font-bold">ADL Number:</span> {s.adl}</p>
                      <p><span className="font-bold">Beneficiaries:</span> {s.beneficiaries}</p>
                      <p><span className="font-bold">Female:</span> {s.female}</p>
                      <p><span className="font-bold">NTP Number:</span> {s.ntpNumber}</p>
                      <p><span className="font-bold">NTP Date:</span> {s.ntpDate}</p>
                      <p><span className="font-bold">Employment Period:</span> {s.period}</p>
                      <p><span className="font-bold">Date Sent to Region (PRE):</span> {s.preSubmitted}</p>
                      <p><span className="font-bold">Date Sent to RO (POST):</span> {s.postSubmitted}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-sm text-zinc-600"></p>
                    <button onClick={() => remove(p.id)} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </details>
            </FadeInUp>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-600">No projects found.</p>
          </div>
        )}
      </div>

      <button
        aria-label="Add Project"
        title="Add Project"
        onClick={openNew}
        className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-800"
      >
        <PlusIcon />
      </button>

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Project"
        actions={
          <button
            onClick={() => {
              if (!draft.adl || !draft.municipality) return;
              const id = crypto.randomUUID();
              setProjects([
                ...projects,
                { id, adl: draft.adl.trim(), beneficiaries: Number(draft.beneficiaries || 0), municipality: draft.municipality.trim(), status: "Pending", preDetails: {}, postDetails: {} } as Project,
              ]);
              setOpenCreate(false);
              setDraft(newDraft());
            }}
            className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800"
          >
            Add
          </button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="ADL Number" name="adl" required value={draft.adl} onChange={(e) => setDraft({ ...draft, adl: e.target.value })} />
          <FormInput label="Municipality" name="municipality" required value={draft.municipality} onChange={(e) => setDraft({ ...draft, municipality: e.target.value })} />
          <FormInput label="Number of Beneficiaries" name="beneficiaries" type="number" min={0} value={draft.beneficiaries} onChange={(e) => setDraft({ ...draft, beneficiaries: parseInt(e.target.value || "0", 10) })} />
        </div>
      </Modal>
    </div>
  );
}
