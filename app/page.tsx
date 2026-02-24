import Link from "next/link";
import Card from "../components/Card";
import { ArrowRightIcon, FolderIcon, HomeIcon, UserIcon } from "../components/Icons";

export default function Home() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card title={<span className="flex items-center gap-2"><HomeIcon /> Welcome</span>} className="sm:col-span-2">
        <p className="text-sm text-zinc-700">
          Manage your profile, create TUPAD projects, and record pre/post implementation details. All data is stored locally on your device.
        </p>
      </Card>
      <Card title={<span className="flex items-center gap-2"><UserIcon /> Profile</span>} actions={<Link className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-800" href="/profile">Open <ArrowRightIcon /></Link>}>
        <p className="text-sm text-zinc-700">Create and manage your personal coordinator profile.</p>
      </Card>
      <Card title={<span className="flex items-center gap-2"><FolderIcon /> Projects</span>} actions={<Link className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-800" href="/projects">Open <ArrowRightIcon /></Link>}>
        <p className="text-sm text-zinc-700">Create, filter, and track TUPAD projects with logsheets.</p>
      </Card>
    </div>
  );
}
