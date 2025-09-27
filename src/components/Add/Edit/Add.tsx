import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Input } from "@headlessui/react";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [emailError, setEmailError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    const hobbies = hobbiesText
      .split(",")
      .map(h => h.trim())
      .filter(Boolean);

    // Collect missing required fields
    const missing: string[] = [];
    if (!form.name.trim()) missing.push("Name");
    if (form.age === undefined) missing.push("Age");
    if (!form.grade.trim()) missing.push("Grade");
    if (!form.schoolName.trim()) missing.push("School Name");
    if (!normalizedEmail) missing.push("Email");
    if (form.phone === undefined) missing.push("Phone");
    if (!form.address.trim()) missing.push("Address");
    if (!hobbies.length) missing.push("Hobbies");
    if (!form.primaryLanguage.trim()) missing.push("Primary Language");

    if (missing.length) {
      alert("Please fill: " + missing.join(", "));
      return;
    }

    // Extra phone length check (should be 10 digits)
    if (String(form.phone!).length !== 10) {
      alert("Phone must be exactly 10 digits.");
      return;
    }

    const payload: import('../../apifolder/api').StudentInput = {
      name: form.name.trim(),
      age: Number(form.age),              // guaranteed defined
      grade: form.grade.trim(),
      schoolName: form.schoolName.trim(),
      email: normalizedEmail,
      phone: Number(form.phone),          // guaranteed defined
      address: form.address.trim(),
      hobbies,
      primaryLanguage: form.primaryLanguage.trim(),
    };

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
    setEmailError(null);
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

          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700 " placeholder="Name" required
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700"
              placeholder="Age"
              type="number"
              required
              min={0}
              max={99}
              value={form.age ?? ""}
              onChange={e => {
                const raw = e.target.value;
                const digits = raw.replace(/\D/g, "").slice(0, 2);
                setForm(f => ({ ...f, age: digits === "" ? undefined : Number(digits) }));
              }}
            />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="Grade"
              value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
            <Input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700" placeholder="School Name"
              value={form.schoolName} onChange={e => setForm(f => ({ ...f, schoolName: e.target.value }))} />
            <Input
              type="email"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              className={`w-full rounded border px-3 py-2 text-gray-700 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email"
              value={form.email}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              onChange={e => {
                const v = e.target.value;
                setForm(f => ({ ...f, email: v }));
                if (emailError && EMAIL_REGEX.test(v.trim().toLowerCase())) {
                  setEmailError(null);
                }
              }}
              onBlur={e => {
                const v = e.target.value.trim().toLowerCase();
                if (!v) setEmailError("Email is required.");
                else if (!EMAIL_REGEX.test(v)) setEmailError("Invalid email format.");
                else setEmailError(null);
              }}
            />
            {emailError && (
              <p id="email-error" className="text-xs text-red-600">
                {emailError}
              </p>
            )}
            <Input
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700"
              placeholder="Phone Number"
              type="text"
              inputMode="numeric"
              pattern="\d{10}"
              required
              maxLength={10}
              value={form.phone === undefined ? "" : String(form.phone)}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm(f => ({ ...f, phone: digits === "" ? undefined : Number(digits) }));
              }}
              onBlur={e => {
                const digits = e.target.value.replace(/\D/g, "");
                if (digits && digits.length < 10) {
                  e.currentTarget.setCustomValidity("Phone must be exactly 10 digits");
                } else {
                  e.currentTarget.setCustomValidity("");
                }
              }}
            />
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