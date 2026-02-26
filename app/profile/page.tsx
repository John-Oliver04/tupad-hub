"use client";
import React, { useMemo, useState } from "react";
import Card from "../../components/Card";
import { FormInput } from "../../components/FormInput";
import Modal from "../../components/Modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../utils/storage";
import { Profile, Project } from "../../utils/types";
import { UserIcon } from "../../components/Icons";

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<Profile>(STORAGE_KEYS.profile, {
    fullName: "",
    position: "",
    municipality: "",
    contactNumber: "",
    avatarUrl: "",
    coverUrl: "",
  });
  const [projects] = useLocalStorage<Project[]>(STORAGE_KEYS.projects, []);

  const [draft, setDraft] = useState<Profile>(profile);
  const [open, setOpen] = useState(false);

  const save = () => {
    setProfile(draft);
    setOpen(false);
  };
  const clear = () =>
    setDraft({ fullName: "", position: "", municipality: "", contactNumber: "", avatarUrl: "", coverUrl: "" });
  const openEdit = () => {
    setDraft(profile);
    setOpen(true);
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const ongoing = total - completed;
    let totalBeneficiaries = 0;
    let totalFemale = 0;
    projects.forEach((p) => {
      const pre = p.preDetails || {};
      const post = p.postDetails || {};
      const ben = post.verification?.totalBeneficiariesActual ?? pre.projectInformation?.totalBeneficiaries ?? 0;
      const fem = post.verification?.totalFemaleActual ?? pre.projectInformation?.totalFemale ?? 0;
      totalBeneficiaries += ben || 0;
      totalFemale += fem || 0;
    });
    const femalePct = totalBeneficiaries > 0 ? Math.min(100, Math.round((totalFemale / totalBeneficiaries) * 100)) : 0;
    return { total, completed, ongoing, totalBeneficiaries, totalFemale, femalePct };
  }, [projects]);

  const initials = (profile.fullName || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div
          className="h-40 w-full bg-zinc-200 md:h-56"
          style={{
            backgroundImage: `url(${profile.coverUrl || "/bg-pattern.svg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="px-4 pb-4">
          <div className="-mt-8 flex items-end gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-600">
                  {initials || <UserIcon />}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white text-shadow ">{profile.fullName || "—"}</div>
              <div className="text-sm text-zinc-600 text-shadow mt-2">{profile.position || "—"} • {profile.municipality || "—"}</div>
              <div className="mt-2 flex justify-end">
                <button onClick={openEdit} className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Personal Details">
          <div className="text-sm text-zinc-700">
            <p><span className="font-medium">Full Name:</span> {profile.fullName || "—"}</p>
            <p><span className="font-medium">Position:</span> {profile.position || "—"}</p>
            <p><span className="font-medium">Municipality:</span> {profile.municipality || "—"}</p>
            <p><span className="font-medium">Contact:</span> {profile.contactNumber || "—"}</p>
          </div>
        </Card>
        <Card title="Accomplishments">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-zinc-900">{stats.total}</div>
              <div className="text-xs text-zinc-600">Total Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
              <div className="text-xs text-zinc-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.ongoing}</div>
              <div className="text-xs text-zinc-600">Ongoing</div>
            </div>
          </div>
        </Card>
        <Card title="Beneficiaries Overview">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">Total Beneficiaries</span>
              <span className="font-semibold text-zinc-900">{stats.totalBeneficiaries}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full bg-blue-600" style={{ width: "100%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">Female</span>
              <span className="font-semibold text-zinc-900">{stats.totalFemale} ({stats.femalePct}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full bg-pink-600" style={{ width: `${stats.femalePct}%` }} />
            </div>
          </div>
        </Card>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Update Profile"
        actions={
          <>
            <button onClick={clear} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">Clear</button>
            <button onClick={save} className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800">Save</button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Full Name" name="fullName" required value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
          <FormInput label="Position" name="position" required value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} />
          <FormInput label="Municipality" name="municipality" required value={draft.municipality} onChange={(e) => setDraft({ ...draft, municipality: e.target.value })} />
          <FormInput label="Contact Number" name="contactNumber" required value={draft.contactNumber} onChange={(e) => setDraft({ ...draft, contactNumber: e.target.value })} />
          <FormInput label="Profile Picture URL" name="avatarUrl" value={draft.avatarUrl || ""} onChange={(e) => setDraft({ ...draft, avatarUrl: e.target.value })} />
          <FormInput label="Cover Photo URL" name="coverUrl" value={draft.coverUrl || ""} onChange={(e) => setDraft({ ...draft, coverUrl: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
