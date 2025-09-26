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

const EditStudentModal: React.FC<Props> = ({ open, student, onClose, onSave }) => {
  const [form, setForm] = useState<EditStudent | null>(student);
  const [hobbiesText, setHobbiesText] = useState('');

  useEffect(() => {
    setForm(student);
    setHobbiesText(student ? student.hobbies.join(', ') : '');
  }, [student]);

  if (!form) return null;

  const change = <K extends keyof EditStudent>(key: K, value: EditStudent[K]) =>
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const hobbies = hobbiesText
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);
    onSave({ ...form, hobbies });
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
              type="number"
              value={form.age}
              onChange={e => change('age', Number(e.target.value) || 0)}
              placeholder="Age"
            />
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              value={form.grade}
              onChange={e => change('grade', e.target.value)}
              placeholder="Grade"
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={form.schoolName}
              onChange={e => change('schoolName', e.target.value)}
              placeholder="School Name"
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              type="email"
              value={form.email}
              onChange={e => change('email', e.target.value)}
              placeholder="Email"
            />
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              type="number"
              value={form.phone}
              onChange={e => change('phone', Number(e.target.value) || 0)}
              placeholder="Phone"
            />
            <input
              className="border rounded px-3 py-2 text-sm text-gray-900"
              value={form.primaryLanguage}
              onChange={e => change('primaryLanguage', e.target.value)}
              placeholder="Primary Language"
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={form.address}
              onChange={e => change('address', e.target.value)}
              placeholder="Address"
            />
            <input
              className="col-span-2 border rounded px-3 py-2 text-sm text-gray-900"
              value={hobbiesText}
              onChange={e => setHobbiesText(e.target.value)}
              placeholder="Hobbies (comma separated)"
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