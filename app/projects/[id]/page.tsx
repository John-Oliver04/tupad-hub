"use client";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../components/Card";
import { FormInput, FormTextArea } from "../../../components/FormInput";
import CostComputation, { CostValues } from "../../../components/CostComputation";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../../utils/storage";
import { PreDetails, Project, ProjectStatus, PostDetails } from "../../../utils/types";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const project = useMemo(() => projects.find((p) => p.id === params.id), [projects, params.id]);

  const [activeTab, setActiveTab] = useState<"pre" | "post">("pre");

  const [pre, setPre] = useState<PreDetails>(project?.preDetails ?? ({} as PreDetails));
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "Pending");
  const [post, setPost] = useState<PostDetails>(project?.postDetails ?? ({} as PostDetails));
  const [naturePost, setNaturePost] = useState<string>(pre.projectInformation?.nameNature || project?.natureOfProject || "");

  const updateProject = (patch: Partial<Project>) => {
    if (!project) return;
    setProjects(projects.map((p) => (p.id === project.id ? { ...p, ...patch } : p)));
  };

  const isPostComplete = (p: PostDetails) => {
    const dt = p.documentTracking;
    const v = p.verification;
    const impl = p.implementation;
    const cost = p.cost;
    return Boolean(
      dt?.dateReceivedPost &&
      dt?.dateSubmittedRO &&
      v?.totalBeneficiariesActual !== undefined &&
      v?.noOfDaysOfWork !== undefined &&
      v?.periodStart &&
      v?.periodEnd &&
      cost?.salaryPerDay !== undefined &&
      impl?.paymentReleasedDate
    );
  };

  // Auto-save PRE changes (with debounce)
  useEffect(() => {
    if (!project) return;
    const t = setTimeout(() => {
      const nature = pre.projectInformation?.nameNature?.trim();
      const nextAdl = (pre.documentTracking?.adlNumber || "").trim() || project.adl;
      updateProject({ preDetails: pre, status, natureOfProject: nature || project.natureOfProject, adl: nextAdl });
    }, 400);
    return () => clearTimeout(t);
  }, [pre, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save POST changes (with debounce) and update status/nature
  useEffect(() => {
    if (!project) return;
    const t = setTimeout(() => {
      const nextStatus: ProjectStatus = isPostComplete(post) ? "Completed" : status;
      const nature = naturePost?.trim();
      const nextAdl = (post.documentTracking?.adlNumber || "").trim() || pre.documentTracking?.adlNumber || project.adl;
      const nextPre: PreDetails = {
        ...pre,
        projectInformation: {
          ...pre.projectInformation,
          nameNature: nature || pre.projectInformation?.nameNature,
        },
      };
      updateProject({ postDetails: post, status: nextStatus, natureOfProject: nature || project.natureOfProject, preDetails: nextPre, adl: nextAdl });
    }, 400);
    return () => clearTimeout(t);
  }, [post, naturePost]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project) return notFound();

  const computeValues: CostValues = {
    totalBeneficiaries: pre.projectInformation?.totalBeneficiaries || project.beneficiaries || 0,
    noOfDays: pre.projectInformation?.noOfDays || 0,
    salaryPerDay: pre.projectCost?.salaryPerDay || 0,
  };

  return (
    <div className="grid gap-4">
      <div className=" items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-800">Project ADL {project.adl}</h2><br/>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/projects")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Back</button>
          <button onClick={() => router.push(`/projects/${project.id}/report`)} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Generate</button>
          <select
            className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* <Card title="Project Summary">
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><span className="font-medium">ADL Number:</span> {pre.documentTracking?.adlNumber || project.adl || "—"}</div>
          <div><span className="font-medium">Beneficiaries:</span> {post.verification?.totalBeneficiariesActual ?? pre.projectInformation?.totalBeneficiaries ?? project.beneficiaries ?? "—"}</div>
          <div><span className="font-medium">Female:</span> {post.verification?.totalFemaleActual ?? pre.projectInformation?.totalFemale ?? "—"}</div>
          <div><span className="font-medium">NTP Number:</span> {pre.documentTracking?.ntpNumber || "—"}</div>
          <div><span className="font-medium">NTP Date:</span> {pre.documentTracking?.noticeToProceedDate || "—"}</div>
          <div><span className="font-medium">Employment Period:</span> {(post.verification?.periodStart || "—") + (post.verification?.periodEnd ? ` - ${post.verification?.periodEnd}` : "")}</div>
          <div><span className="font-medium">Date Sent to Region (PRE):</span> {pre.documentTracking?.dateSubmittedRO || "—"}</div>
          <div><span className="font-medium">Date Sent to RO (POST):</span> {post.documentTracking?.dateSubmittedRO || "—"}</div>
        </div>
      </Card> */}

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("pre")}
            className={`rounded-md px-3 py-1.5 text-sm ${activeTab === "pre" ? "bg-blue-700 text-white" : "border border-zinc-300 bg-white hover:bg-zinc-50"}`}
          >
            PRE DETAILS
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`rounded-md px-3 py-1.5 text-sm ${activeTab === "post" ? "bg-blue-700 text-white" : "border border-zinc-300 bg-white hover:bg-zinc-50"}`}
          >
            POST DETAILS
          </button>
        </div>

        {activeTab === "pre" ? (
          <div className="space-y-4">
            <details className="rounded-lg border border-blue-300 border-l-4 border-l-blue-500 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                Project Information
              </summary>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <FormInput
                  label="ADL Number"
                  name="adlNumber"
                  value={pre.documentTracking?.adlNumber || project.adl}
                  onChange={(e) => setPre({ ...pre, documentTracking: { ...pre.documentTracking, adlNumber: e.target.value } })}
                />
                <FormInput
                  label="Name & Nature of Project"
                  name="nameNature"
                  value={pre.projectInformation?.nameNature || ""}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, nameNature: e.target.value } })}
                />
                <FormInput
                  label="Name of Proponent"
                  name="proponent"
                  value={pre.projectInformation?.proponent || ""}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, proponent: e.target.value } })}
                />
                <FormInput
                  label="Project Location"
                  name="location"
                  value={pre.projectInformation?.location || ""}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, location: e.target.value } })}
                />
                <FormInput
                  label="Total Beneficiaries"
                  name="totalBeneficiaries"
                  type="number"
                  min={0}
                  value={pre.projectInformation?.totalBeneficiaries ?? project.beneficiaries ?? 0}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, totalBeneficiaries: parseInt(e.target.value || "0", 10) } })}
                />
                <FormInput
                  label="Total Female"
                  name="totalFemale"
                  type="number"
                  min={0}
                  value={pre.projectInformation?.totalFemale ?? 0}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, totalFemale: parseInt(e.target.value || "0", 10) } })}
                />
                <FormInput
                  label="No. of Days"
                  name="noOfDays"
                  type="number"
                  min={0}
                  value={pre.projectInformation?.noOfDays ?? 0}
                  onChange={(e) => setPre({ ...pre, projectInformation: { ...pre.projectInformation, noOfDays: parseInt(e.target.value || "0", 10) } })}
                />
              </div>
            </details>
            
            <details className="rounded-lg border border-blue-300 border-l-4 border-l-blue-500 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                Document Tracking
              </summary>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <FormInput
                  label="Date Received from Regional Office"
                  name="dateReceivedRO"
                  type="date"
                  value={pre.documentTracking?.dateReceivedRO || ""}
                  onChange={(e) => setPre({ ...pre, documentTracking: { ...pre.documentTracking, dateReceivedRO: e.target.value } })}
                />
                <FormInput
                  label="Date Submitted to Regional Office"
                  name="dateSubmittedRO"
                  type="date"
                  value={pre.documentTracking?.dateSubmittedRO || ""}
                  onChange={(e) => setPre({ ...pre, documentTracking: { ...pre.documentTracking, dateSubmittedRO: e.target.value } })}
                />
                <FormInput
                  label="Received Notice to Proceed (NTP Date)"
                  name="noticeToProceedDate"
                  type="date"
                  value={pre.documentTracking?.noticeToProceedDate || ""}
                  onChange={(e) => setPre({ ...pre, documentTracking: { ...pre.documentTracking, noticeToProceedDate: e.target.value } })}
                />
                <FormInput
                  label="NTP Number"
                  name="ntpNumber"
                  value={pre.documentTracking?.ntpNumber || ""}
                  onChange={(e) => setPre({ ...pre, documentTracking: { ...pre.documentTracking, ntpNumber: e.target.value } })}
                />
              </div>
            </details>


            <details className="rounded-lg border border-blue-300 border-l-4 border-l-blue-500 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                Project Cost Computation
              </summary>
              <div className="p-4">
                <CostComputation
                  values={computeValues}
                  onChange={(next) => {
                    const salaryPerDay = next.salaryPerDay ?? pre.projectCost?.salaryPerDay ?? 0;
                    const totalBeneficiaries = next.totalBeneficiaries ?? pre.projectInformation?.totalBeneficiaries ?? project.beneficiaries ?? 0;
                    const noOfDays = next.noOfDays ?? pre.projectInformation?.noOfDays ?? 0;
                    const laborCost = totalBeneficiaries * noOfDays * salaryPerDay;
                    const ppe = totalBeneficiaries * 250;
                    const insurance = totalBeneficiaries * 50;
                    const total = laborCost + ppe + insurance;
                    setPre({
                      ...pre,
                      projectInformation: {
                        ...pre.projectInformation,
                        totalBeneficiaries,
                        noOfDays,
                      },
                      projectCost: {
                        salaryPerDay,
                        laborCost,
                        ppe,
                        insurance,
                        total,
                      },
                    });
                  }}
                />
              </div>
            </details>

            <details className="rounded-lg border border-blue-300 border-l-4 border-l-blue-500 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                Implementation Details
              </summary>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <FormInput
                  label="Orientation Date"
                  name="orientationDate"
                  type="date"
                  value={pre.implementation?.orientationDate || ""}
                  onChange={(e) => setPre({ ...pre, implementation: { ...pre.implementation, orientationDate: e.target.value } })}
                />
                <FormInput
                  label="Payment of Wages (Date)"
                  name="paymentDate"
                  type="date"
                  value={pre.implementation?.paymentDate || ""}
                  onChange={(e) => setPre({ ...pre, implementation: { ...pre.implementation, paymentDate: e.target.value } })}
                />
                <FormTextArea
                  label="Remarks"
                  name="remarks"
                  value={pre.implementation?.remarks || ""}
                  onChange={(e) => setPre({ ...pre, implementation: { ...pre.implementation, remarks: e.target.value } })}
                />
              </div>
            </details>

            {/* Auto-saved */}
          </div>
        ) : (
          <div className="space-y-4">
            <Card title="Auto-filled from PRE DETAILS" className="border-amber-300">
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <div className="font-medium text-zinc-700">ADL Number</div>
                  <div className="text-zinc-800">{pre.documentTracking?.adlNumber || project.adl || "—"}</div>
                </div>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-zinc-700">Name & Nature of Project</span>
                  <input
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={naturePost}
                    onChange={(e) => setNaturePost(e.target.value)}
                    placeholder="e.g., Clean-up Drive, Barangay XYZ"
                  />
                </label>
                <div>
                  <div className="font-medium text-zinc-700">Name of Proponent</div>
                  <div className="text-zinc-800">{pre.projectInformation?.proponent || "—"}</div>
                </div>
                <div>
                  <div className="font-medium text-zinc-700">Project Location</div>
                  <div className="text-zinc-800">{pre.projectInformation?.location || "—"}</div>
                </div>
              </div>
            </Card>

            <details className="rounded-lg border border-green-300 border-l-4 border-l-green-600 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-green-50 px-4 py-2 text-sm font-semibold text-green-900">
                Document Tracking
              </summary>    
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <FormInput
                  label="ADL Number"
                  name="post_adl"
                  value={post.documentTracking?.adlNumber ?? pre.documentTracking?.adlNumber ?? project.adl ?? ""}
                  onChange={(e) => setPost({ ...post, documentTracking: { ...post.documentTracking, adlNumber: e.target.value } })}
                />
                <FormInput
                  label="Date Received of Post Employment"
                  name="dateReceivedPost"
                  type="date"
                  value={post.documentTracking?.dateReceivedPost || ""}
                  onChange={(e) => setPost({ ...post, documentTracking: { ...post.documentTracking, dateReceivedPost: e.target.value } })}
                />
                <FormInput
                  label="Submitted to Regional Office (Date)"
                  name="post_dateSubmittedRO"
                  type="date"
                  value={post.documentTracking?.dateSubmittedRO || ""}
                  onChange={(e) => setPost({ ...post, documentTracking: { ...post.documentTracking, dateSubmittedRO: e.target.value } })}
                />
              </div>
            </details>

            <details className="rounded-lg border border-green-300 border-l-4 border-l-green-600 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-green-50 px-4 py-2 text-sm font-semibold text-green-900">
                Project Verification
              </summary>  
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2 text-xs text-zinc-600">Values may differ from PRE DETAILS due to unsigned contracts or actual attendance</div>
                <FormInput
                  label="Total Beneficiaries (Actual Signed)"
                  name="totalBeneficiariesActual"
                  type="number"
                  min={0}
                  value={post.verification?.totalBeneficiariesActual ?? 0}
                  onChange={(e) => setPost({ ...post, verification: { ...post.verification, totalBeneficiariesActual: parseInt(e.target.value || "0", 10) } })}
                />
                <FormInput
                  label="Total Female (Actual Signed)"
                  name="totalFemaleActual"
                  type="number"
                  min={0}
                  value={post.verification?.totalFemaleActual ?? 0}
                  onChange={(e) => setPost({ ...post, verification: { ...post.verification, totalFemaleActual: parseInt(e.target.value || "0", 10) } })}
                />
                <FormInput
                  label="No. of Days of Work"
                  name="noOfDaysOfWork"
                  type="number"
                  min={0}
                  value={post.verification?.noOfDaysOfWork ?? 0}
                  onChange={(e) => setPost({ ...post, verification: { ...post.verification, noOfDaysOfWork: parseInt(e.target.value || "0", 10) } })}
                />
                <FormInput
                  label="Implementation Start Date"
                  name="periodStart"
                  type="date"
                  value={post.verification?.periodStart || ""}
                  onChange={(e) => setPost({ ...post, verification: { ...post.verification, periodStart: e.target.value } })}
                />
                <FormInput
                  label="Implementation End Date"
                  name="periodEnd"
                  type="date"
                  value={post.verification?.periodEnd || ""}
                  onChange={(e) => setPost({ ...post, verification: { ...post.verification, periodEnd: e.target.value } })}
                />
                <div className="sm:col-span-2">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${((post.verification?.totalBeneficiariesActual ?? -1) !== (pre.projectInformation?.totalBeneficiaries ?? -1)) ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                    {((post.verification?.totalBeneficiariesActual ?? -1) !== (pre.projectInformation?.totalBeneficiaries ?? -1)) ? "Actual differs from PRE total beneficiaries" : "Matches PRE total beneficiaries"}
                  </span>
                </div>
              </div>
            </details>

            <details className="rounded-lg border border-green-300 border-l-4 border-l-green-600 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-green-50 px-4 py-2 text-sm font-semibold text-green-900">Project Cost Computation</summary>
              <div className="p-4">
                <CostComputation
                  values={{
                    salaryPerDay: post.cost?.salaryPerDay || 0,
                    totalBeneficiaries: post.verification?.totalBeneficiariesActual || 0,
                    noOfDays: post.verification?.noOfDaysOfWork || 0,
                  }}
                  onChange={(next) => {
                    const salaryPerDay = next.salaryPerDay ?? post.cost?.salaryPerDay ?? 0;
                    const totalBeneficiaries = next.totalBeneficiaries ?? post.verification?.totalBeneficiariesActual ?? 0;
                    const noOfDays = next.noOfDays ?? post.verification?.noOfDaysOfWork ?? 0;
                    const laborCost = totalBeneficiaries * noOfDays * salaryPerDay;
                    const ppe = totalBeneficiaries * 250;
                    const insurance = totalBeneficiaries * 50;
                    const total = laborCost + ppe + insurance;
                    setPost({
                      ...post,
                      verification: {
                        ...post.verification,
                        totalBeneficiariesActual: totalBeneficiaries,
                        noOfDaysOfWork: noOfDays,
                      },
                      cost: {
                        salaryPerDay,
                        laborCost,
                        ppe,
                        insurance,
                        total,
                      },
                    });
                  }}
                />
                <div className="mt-2 text-xs text-zinc-600">Computation is based on actual signed beneficiaries</div>
              </div>
            </details>

            <details className="rounded-lg border border-green-300 border-l-4 border-l-green-600 shadow-xs" open>
              <summary className="cursor-pointer select-none list-none bg-green-50 px-4 py-2 text-sm font-semibold text-green-900">Implementation Summary</summary>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <FormInput
                  label="Payment of Wages (Date Released)"
                  name="paymentReleasedDate"
                  type="date"
                  value={post.implementation?.paymentReleasedDate || ""}
                  onChange={(e) => setPost({ ...post, implementation: { ...post.implementation, paymentReleasedDate: e.target.value } })}
                />
                <FormTextArea
                  label="Remarks"
                  name="post_remarks"
                  value={post.implementation?.remarks || ""}
                  onChange={(e) => setPost({ ...post, implementation: { ...post.implementation, remarks: e.target.value } })}
                />
              </div>
            </details>

            {/* Auto-saved */}
          </div>
        )}
      </Card>
    </div>
  );
}
