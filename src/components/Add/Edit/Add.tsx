import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle,Input } from "@headlessui/react";

export type StudentInput = {
  name: string;
  age?: number;
  grade: string;
  schoolName: string;
  email: string;
  phone?: number;
  address: string;
  hobbies: string[];           // parsed from comma-separated input
  primaryLanguage: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (student: import('../../apifolder/api').StudentInput) => void;
};

export default function AddStudentModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<StudentInput>({
    name: "",
    age: undefined,
    grade: "",
    schoolName: "",
    email: "",
    phone: undefined,
    address: "",
    hobbies: [],
    primaryLanguage: "",
  });

  const [hobbiesText, setHobbiesText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const hobbies = hobbiesText
      .split(",")
      .map(h => h.trim())
      .filter(Boolean);

    const payload: import('../../apifolder/api').StudentInput = {
      name: form.name.trim(),
      age: form.age ? Number(form.age) : 0,         // adjust if backend disallows 0
      grade: form.grade.trim(),
      schoolName: form.schoolName.trim(),
      email: form.email.trim(),
      phone: form.phone ? Number(form.phone) : 0,   // adjust similarly
      address: form.address.trim(),
      hobbies,
      primaryLanguage: form.primaryLanguage.trim(),
    };

    console.log('Add payload:', payload);
    onSave(payload);

    setForm({
      name: "",
      age: undefined,
      grade: "",
      schoolName: "",
      email: "",
      phone: undefined,
      address: "",
      hobbies: [],
      primaryLanguage: "",
    });
    setHobbiesText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 text-gray-500">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
          <DialogTitle className="text-lg font-semibold text-blue-500">
            Add New Student
          </DialogTitle>

          <form className="mt-4 space-y-3 " onSubmit={submit}>
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700 " placeholder="Name" required
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Age" type="number"
              value={form.age ?? ""} onChange={e => setForm(f => ({ ...f, age: Number(e.target.value) || undefined }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Grade"
              value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="School Name"
              value={form.schoolName} onChange={e => setForm(f => ({ ...f, schoolName: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Email"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Phone" type="number"
              value={form.phone ?? ""} onChange={e => setForm(f => ({ ...f, phone: Number(e.target.value) || undefined }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Address"
              value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Hobbies (comma separated)"
              value={hobbiesText} onChange={e => setHobbiesText(e.target.value)} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Primary Language"
              value={form.primaryLanguage} onChange={e => setForm(f => ({ ...f, primaryLanguage: e.target.value }))} />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose}
                className="px-3 py-2 rounded border border-gray-300 text-gray-700">
                Cancel
              </button>
              <button type="submit"
                className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}