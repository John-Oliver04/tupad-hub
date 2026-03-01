"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import Modal from "../../components/Modal";
import { FadeInUp } from "../../components/Motion";
import { ArrowRightIcon, PlusIcon, PrintIcon } from "../../components/Icons";
import { FormInput } from "../../components/FormInput";
import useLocalStorage from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../utils/storage";
import { Project } from "../../utils/types";

type Draft = {
  adl: string;
  beneficiaries: number;
  municipality: string;
};

const newDraft = (): Draft => ({ adl: "", beneficiaries: 0, municipality: "" });

export default function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const [draft, setDraft] = useState<Draft>(newDraft());
  // filters intentionally removed

  // inline create handled via modal

  const remove = (id: string) => setProjects(projects.filter((p) => p.id !== id));

  const filtered = useMemo(() => {
    return projects;
  }, [projects]);

  // persist open/closed states for details per project
  const [openMap, setOpenMap] = useLocalStorage<Record<string, boolean>>("projects_open_map", {});
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

  const exportProjectToCsv = (p: Project) => {
    const pre = p.preDetails || {};
    const post = p.postDetails || {};
    const preDoc = pre.documentTracking || {};
    const preInfo = pre.projectInformation || {};
    const preCost = pre.projectCost || {};
    const preImpl = pre.implementation || {};
    const postDoc = post.documentTracking || {};
    const postInfo = preInfo;
    const postVer = post.verification || {};
    const postCost = post.cost || {};
    const postImpl = post.implementation || {};

    const escape = (v: string | number) => {
      const str = String(v ?? "").replace(/"/g, '""');
      return `"${str}"`;
    };

    const header = [
      "DATE RECEIVED FROM RO",
      "ADL",
      "DATE SUBMITTED FROM RO",
      "NAME AND NATURE OF PROJECT",
      "NAME OF PROPONENT",
      "PROJECT LOCATION",
      "TOTAL BENEFICIARIES",
      "TOTAL FEMALE",
      "NO. OF DAYS",
      "LABOR COST",
      "PPE",
      "INSURANCE",
      "TOTAL",
      "RECEIVED NOTICE TO PROCEED (NTP DATE)",
      "ORIENTATION DATE",
      "REMARKS",
      " ",
      "ADL NO.",
      "DATE RECEIVED (POST)",
      "NAME AND NATURE OF PROJECT",
      "NAME OF PROPONENT",
      "PROJECT LOCATION",
      "TOTAL BENEFICIARIES",
      "TOTAL FEMALE",
      "NO. OF DAYS OF WORK",
      "IMPLEMENTATION PERIOD",
      "LABOR COST",
      "PPE",
      "INSURANCE",
      "TOTAL",
      "SUBMITTED TO RO",
      "PAYMENT OF WAGES",
      "REMARKS",
    ]
      .map(escape)
      .join(";");

    const implementationPeriod =
      (postVer.periodStart || "") +
      (postVer.periodEnd ? ` - ${postVer.periodEnd}` : "");

    const row = [
      preDoc.dateReceivedRO || "",
      preDoc.adlNumber || p.adl || "",
      preDoc.dateSubmittedRO || "",
      preInfo.nameNature || "",
      preInfo.proponent || "",
      preInfo.location || "",
      preInfo.totalBeneficiaries ?? p.beneficiaries ?? "",
      preInfo.totalFemale ?? "",
      preInfo.noOfDays ?? "",
      preCost.laborCost ?? "",
      preCost.ppe ?? "",
      preCost.insurance ?? "",
      preCost.total ?? "",
      preDoc.noticeToProceedDate || "",
      preImpl.orientationDate || "",
      preImpl.remarks || "",
      "",
      postDoc.adlNumber || preDoc.adlNumber || p.adl || "",
      postDoc.dateReceivedPost || "",
      postInfo.nameNature || "",
      postInfo.proponent || "",
      postInfo.location || "",
      postVer.totalBeneficiariesActual ??
        preInfo.totalBeneficiaries ??
        p.beneficiaries ??
        "",
      postVer.totalFemaleActual ?? preInfo.totalFemale ?? "",
      postVer.noOfDaysOfWork ?? preInfo.noOfDays ?? "",
      implementationPeriod,
      postCost.laborCost ?? "",
      postCost.ppe ?? "",
      postCost.insurance ?? "",
      postCost.total ?? "",
      postDoc.dateSubmittedRO || "",
      postImpl.paymentReleasedDate || "",
      postImpl.remarks || "",
    ]
      .map(escape)
      .join(";");

    const crlf = "\r\n";
    const csv = "\uFEFF" + header + crlf + row + crlf;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tupad-project-ADL-${(p.adl || "export").replace(/\s/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [swipedId, setSwipedId] = useState<string | null>(null);

  return (
    <div className="grid gap-4 relative mb-28">
      <h2 className="text-lg font-semibold text-emerald-800">Projects</h2>
      <Link
        href="/projects/report"
        aria-label="Print all projects"
        className="fixed right-2 top-15 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-emerald-700/40 text-zinc-800 shadow hover:bg-emerald-600/40"
        title="Print All"
      >
        <PrintIcon />
      </Link>

      {/* Filters hidden as requested */}
      <div className="hidden" />

      <div className="grid gap-3 sm:grid-cols-2 ">
        {filtered.map((p) => {
          const s = summarize(p);
          const headBg = p.status === "Completed" ? "bg-green-50 text-green-900" : "bg-blue-50 text-blue-900";
          return (
          <FadeInUp key={p.id}>
            <div className="relative mb-3 ">

              {/* DELETE BACKGROUND */}
              <div className="absolute inset-0 flex justify-end items-center bg-red-300/40 rounded-xl px-6 overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-400/30 blur-2xl" ></div>
    
                <button
                  onClick={() => remove(p.id)}
                  className="text-red-400 font-semibold"
                >
                  Delete
                </button>
              </div>

              {/* FOREGROUND CARD */}
              <div
                onTouchStart={(e) => {
                  const startX = e.touches[0].clientX;
                  e.currentTarget.dataset.startX = startX.toString();
                }}
                onTouchEnd={(e) => {
                  const startX = Number(e.currentTarget.dataset.startX);
                  const endX = e.changedTouches[0].clientX;

                  if (startX - endX > 60) {
                    setSwipedId(p.id); // swipe left
                  }

                  if (endX - startX > 60) {
                    setSwipedId(null); // swipe right
                  }
                }}
                className={`relative bg-green-50 rounded-xl shadow-sm border border-emerald-200 transition-transform duration-300 overflow-hidden ${
                  swipedId === p.id ? "-translate-x-28" : "translate-x-0"
                }`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/30 blur-2xl" ></div>
                <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" ></div>
        
                {/* CARD HEADER */}
                <div
                  onClick={() =>
                    setOpenMap({ ...openMap, [p.id]: !openMap[p.id] })
                  }
                  className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-emerald-700/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      ADL {s.adl}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {p.municipality} • {s.beneficiaries}/{s.postBeneficiaries} Ben.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.status || "Pending"}
                    </span>

                    <ArrowRightIcon
                      className={`transition-transform ${
                        openMap[p.id] ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* EXPAND CONTENT */}
                {openMap[p.id] && (
                  <div className="border-t bg-zinc-50 px-4 py-4 text-sm text-zinc-700 space-y-1 ">
                    <p><strong>ADL:</strong><br /> {p.adl}</p>
                    <p><strong>Municipality:</strong><br /> {p.municipality}</p>
                    <p><strong>Beneficiary:</strong> <br />{p.beneficiaries}</p>
                    <p><strong>Nature of Project:</strong><br /> {p.natureOfProject || "N/A"}</p>

                    <div className="pt-3 flex flex-wrap gap-2 justify-end">
                      <Link
                        href={`/projects/${p.id}/report`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        Print
                      </Link>
                      <button
                        type="button"
                        onClick={() => exportProjectToCsv(p)}
                        className="rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        Excel
                      </button>
                      <Link
                        href={`/projects/${p.id}`}
                        className="rounded-lg bg-emerald-700/60 px-3 py-1.5 text-sm text-white hover:bg-emerald-800/90"
                      >
                        Open Project
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
        className="fixed bottom-20 right-6 z-30 inline-flex rounded-full h-14 w-14 items-center justify-center bg-emerald-700/40 text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-emerald-700/50"
      >
        <PlusIcon />
      </button>

      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create Project"
      >
        <div className="flex flex-col h-full">

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4">

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-900">
              Enter project details to create a new TUPAD record.
            </div>

            <div className="space-y-4">

              <FormInput
                label="ADL Number"
                name="adl"
                required
                value={draft.adl}
                onChange={(e) => setDraft({ ...draft, adl: e.target.value })}
              />

              <FormInput
                label="Municipality"
                name="municipality"
                required
                value={draft.municipality}
                onChange={(e) => setDraft({ ...draft, municipality: e.target.value })}
              />

              <FormInput
                label="Number of Beneficiaries"
                name="beneficiaries"
                type="number"
                min={0}
                value={draft.beneficiaries}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    beneficiaries: parseInt(e.target.value || "0", 10),
                  })
                }
              />

            </div>
          </div>

          {/* Bottom Action */}
          <div className="sticky bottom-0 bg-white  pt-3 pb-2">
            <button
              onClick={() => {
                if (!draft.adl || !draft.municipality) return;

                const id = crypto.randomUUID();

                setProjects([
                  ...projects,
                  {
                    id,
                    adl: draft.adl.trim(),
                    beneficiaries: Number(draft.beneficiaries || 0),
                    municipality: draft.municipality.trim(),
                    status: "Pending",
                    preDetails: {},
                    postDetails: {},
                  } as Project,
                ]);

                setOpenCreate(false);
                setDraft(newDraft());
              }}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-800/40 to-emerald-600/40 py-3 text-sm font-semibold tracking-wide text-white shadow-md hover:shadow-lg active:scale-[0.96] transition-all duration-150" >
                 Save
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}
