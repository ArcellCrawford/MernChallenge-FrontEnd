import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export interface EditStudent {
  id: string; // was number
  name: string;
  age: number;
  email: string;
  phone: number;
  address: string;
  grade: string;
  schoolName: string;
  hobbies: string[];
  primaryLanguage: string;
}

interface Props {
  open: boolean;
  student: EditStudent | null;
  onClose: () => void;
  onSave: (updated: EditStudent) => void; // stays same but now string id
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditStudentModal: React.FC<Props> = ({ open, student, onClose, onSave }) => {
  const [form, setForm] = useState<EditStudent | null>(student);
  const [hobbiesText, setHobbiesText] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    setForm(student);
    setHobbiesText(student ? student.hobbies.join(', ') : '');
  }, [student]);

  if (!form) return null;

  const change = <K extends keyof EditStudent>(key: K, value: EditStudent[K]) =>
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const normalizedEmail = form.email.trim().toLowerCase();
    const hobbies = hobbiesText
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    // Collect missing fields
    const missing: string[] = [];
    if (!form.name.trim()) missing.push('Name');
    if (form.age === undefined || Number.isNaN(form.age)) missing.push('Age');
    if (!form.grade.trim()) missing.push('Grade');
    if (!form.schoolName.trim()) missing.push('School Name');
    if (!normalizedEmail) missing.push('Email');
    if (form.phone === undefined || String(form.phone).length !== 10) missing.push('Phone (10 digits)');
    if (!form.primaryLanguage.trim()) missing.push('Primary Language');
    if (!form.address.trim()) missing.push('Address');
    if (!hobbies.length) missing.push('Hobbies');

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Please enter a valid email.');
      return;
    }

    if (missing.length) {
      alert('Please fill: ' + missing.join(', '));
      return;
    }

    onSave({
      ...form,
      email: normalizedEmail,
      hobbies,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
            Edit Student (ID: {form.id})
          </DialogTitle>
          <form onSubmit={submit} className="grid grid-cols-2 gap-4">
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={form.name}
              onChange={e => change('name', e.target.value)}
              placeholder="Name"
              required
            />
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              type="text"
              inputMode="numeric"
              pattern="\d{1,2}"
              maxLength={2}
              required
              value={form.age === undefined ? '' : String(form.age)}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                change('age', digits === '' ? (undefined as any) : Number(digits));
              }}
              onBlur={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                change('age', digits === '' ? (undefined as any) : Number(digits));
              }}
              placeholder="Age"
            />
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              value={form.grade}
              onChange={e => change('grade', e.target.value)}
              placeholder="Grade"
              required
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={form.schoolName}
              onChange={e => change('schoolName', e.target.value)}
              placeholder="School Name"
              required
            />
            <input
              className={`col-span-2 border rounded px-3 py-2 text-sm text-gray-900 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              type="email"
              value={form.email}
              placeholder="Email"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'edit-email-error' : undefined}
              onChange={e => {
                const v = e.target.value;
                change('email', v);
                if (emailError && EMAIL_REGEX.test(v.trim().toLowerCase())) {
                  setEmailError(null);
                }
              }}
              onBlur={e => {
                const v = e.target.value.trim().toLowerCase();
                if (!v) setEmailError('Email is required.');
                else if (!EMAIL_REGEX.test(v)) setEmailError('Invalid email format.');
                else setEmailError(null);
              }}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            {emailError && (
              <p id="edit-email-error" className="col-span-2 text-xs text-red-600 -mt-1">
                {emailError}
              </p>
            )}
            <input
              className={`border rounded px-3 py-2 text-sm text-gray-900 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              required
              placeholder="Phone (10 digits)"
              value={form.phone === undefined ? '' : String(form.phone)}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? 'edit-phone-error' : undefined}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhoneError(null);
                change('phone', digits === '' ? (undefined as any) : Number(digits));
              }}
              onBlur={e => {
                const digits = e.target.value.replace(/\D/g, '');
                if (digits.length !== 10) {
                  setPhoneError('Phone must be exactly 10 digits.');
                } else {
                  setPhoneError(null);
                }
              }}
            />
            {phoneError && (
              <p id="edit-phone-error" className="text-xs text-red-600 -mt-1">
                {phoneError}
              </p>
            )}
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              value={form.primaryLanguage}
              onChange={e => change('primaryLanguage', e.target.value)}
              placeholder="Primary Language"
              required
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={form.address}
              onChange={e => change('address', e.target.value)}
              placeholder="Address"
              required
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={hobbiesText}
              onChange={e => setHobbiesText(e.target.value)}
              placeholder="Hobbies (comma separated)"
              required
            />
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditStudentModal;