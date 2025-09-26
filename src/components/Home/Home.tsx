import React, {useState, useEffect} from "react";

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions,Button } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import AddIcon from '../../assets/Add.png';
import DeleteIcon from '../../assets/Delete.png';
import AddModal from "../Add/Edit/Add";
import EditStudentModal from '../Add/Edit/EditStudentModal';
import { StudentsApi, type StudentInput } from '../../components/apifolder/api';

type User = {
  id: string;  // mirrors Mongo _id
  name: string;
  age: number;
  email: string;
  phone: number;
  address: string;
  grade: string;
  schoolName: string;
  hobbies: string[];
  primaryLanguage: string;
};

const Home: React.FC = () => {
//Hardcoded user Data
   const userData: User[] =[
];

const [showAdd, setShowAdd] = useState(false);
// Use state for table data
const [data, setData] = useState<User[]>(userData);
const [originalData, setOriginalData] = useState<User[]>([]);
const [sorted, setSorted] = useState(false);
// Pagination (2 pages for 20 items)
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;
const pageCount = Math.ceil(data.length / pageSize);
const start = (currentPage - 1) * pageSize;
const currentPageData = data.slice(start, start + pageSize);

// selection state for checkboxes
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const toggleOne = (id: string) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

const [editOpen, setEditOpen] = useState(false);
const [editingStudent, setEditingStudent] = useState<User | null>(null);

//Column names
  const columns: { header: string; accessor: keyof User }[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Grade', accessor: 'grade' },
    { header: 'School Name', accessor: 'schoolName' },
    { header: 'Hobbies', accessor: 'hobbies' },
    { header: 'Primary Language', accessor: 'primaryLanguage' },
  ];

//Puts in alphabetical order based on name
const handlesubmit = () => {
  if (!selected) return;
  let sortedData: User[] | null = null;
  switch (selected.sortType) {
    case 'Name':
      sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'Age':
      sortedData = [...data].sort((a, b) => a.age - b.age);
      break;
    case 'Grade':
      sortedData = [...data].sort((a, b) => a.grade.localeCompare(b.grade));
      break;
    case 'SchoolName':
      sortedData = [...data].sort((a, b) => a.schoolName.localeCompare(b.schoolName));
      break;
    default:
      // Reset to original (not empty)
      setData(originalData);
      setSorted(false);
      return;
  }
  setData(sortedData!);
  setSorted(true);
};

const openEdit = (student: User) => {
  setEditingStudent(student);
  setEditOpen(true);
};


const handleEditSave = (updated: User) => {
  if (!updated.id) return;

  // Optimistic UI update
  setData(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  setEditOpen(false);

  StudentsApi.update(updated.id, {
    name: updated.name,
    age: updated.age,
    email: updated.email,
    phone: updated.phone,
    address: updated.address,
    grade: updated.grade,
    schoolName: updated.schoolName,
    hobbies: updated.hobbies,
    primaryLanguage: updated.primaryLanguage,
  })
    .then(saved => {
      const normalized: User = {
        ...saved,
        id: String(saved._id || saved.id),
        hobbies: Array.isArray(saved.hobbies) ? saved.hobbies : []
      };
      setData(prev => prev.map(s => (s.id === normalized.id ? { ...s, ...normalized } : s)));
    })
    .catch(err => {
      console.error('Update failed, reverting', err);
      refreshStudents(); // fallback to server truth
    });
};

useEffect(() => {
  StudentsApi.list()
    .then(students => {
      const normalized: User[] = students.map((s: any) => {
        const rawId = s._id ?? s.id;
        const safeId = rawId ? String(rawId) : crypto.randomUUID();
        return {
          ...s,
            id: safeId,
            hobbies: Array.isArray(s.hobbies) ? s.hobbies : []
        };
      });
      setData(normalized);
      setOriginalData(normalized);
    })
    .catch(e => console.error('Failed to fetch students', e));
}, []);

// Optional helper to refetch if needed
const refreshStudents = () => {
  StudentsApi.list()
    .then(students => {
      setData(students.map((s: any) => ({
        ...s,
        id: String(s._id || s.id),
        hobbies: Array.isArray(s.hobbies) ? s.hobbies : []
      })));
    })
    .catch(e => console.error('Refresh failed', e));
};

const handleSaveStudent = (input: StudentInput) => {
  console.log('Create request:', input);
  StudentsApi.create(input)
    .then((created: any) => {
      console.log('Create response:', created);
      const rawId = created._id ?? created.id;
      const safeId = rawId ? String(rawId) : crypto.randomUUID();
      const newStudent: User = {
        ...created,
        id: safeId,
        hobbies: Array.isArray(created.hobbies) ? created.hobbies : []
      };
      // Put new at top (or change to [...prev, newStudent] for bottom)
      setData(prev => [newStudent, ...prev]);
      setOriginalData(prev => [newStudent, ...prev]);
      setCurrentPage(1);
      setSelectedIds(new Set());
     
    })
    .catch(e => {
      console.error('Create failed:', e);
    });
};

const handleDeleteSelected = () => {
  if (selectedIds.size === 0) return;
  const ids = Array.from(selectedIds);
  StudentsApi.removeMany(ids)
    .then((_: unknown): void => {
      setData((prev: User[]): User[] => {
        const next: User[] = prev.filter((r: User) => !selectedIds.has(r.id));
        const newPageCount: number = Math.ceil(next.length / pageSize);
        setCurrentPage((cp: number): number => Math.min(cp, Math.max(1, newPageCount || 1)));
        return next;
      });
      setSelectedIds(new Set<string>());
    })
    .catch((e: unknown) => console.error('Delete failed', e));
};

const sortBy = [
  { id: 1, sortType: 'Name' },
  { id: 2, sortType: 'Age' },
  { id: 3, sortType: 'Grade' },
  { id: 4, sortType: 'SchoolName' },

]
 const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<{ id: number; sortType: string } | null>(sortBy[1])

  const filteredPeople =
    query === ''
      ? sortBy
      : sortBy.filter((sort) => {
          return sort.sortType.toLowerCase().includes(query.toLowerCase())
        })

return (
  <div className="flex flex-col justify-start min-h-screen bg-white/95 min-w-screen text-white p-4">
    {/* Page title */}
    <h1 className="w-full text-center text-3xl font-bold text-blue-500 ">
      Students Table
    </h1>

    {/* Combo box and button side by side */}
    <div className="flex flex-row items-center mb-6 w-full">
      <Combobox
        value={selected}
        onChange={(value) => setSelected(value)}
        onClose={() => setQuery('')}
      >
        <div className="relative w-auto">
          <ComboboxInput
            className={clsx(
              'rounded-lg border-none bg-blue-500 py-1.5 pr-8 pl-3 text-sm/6 text-white w-auto',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
            )}
            displayValue={(option: { id: number; sortType: string } | null) => option?.sortType || ""}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'rounded-xl border border-white/5 bg-blue-500 p-1 empty:invisible',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {filteredPeople.map((sortie) => (
            <ComboboxOption
              key={sortie.id}
              value={sortie}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <div className="text-sm/6 text-white flex items-center gap-2">
                {sortie.sortType}
              </div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
      {/* Sort Button */}
      <Button
        className="bg-blue-500 text-white rounded hover:bg-blue-600 ml-4 px-4 py-2"
        type="button"
        onClick={handlesubmit}
      >
        Sort
      </Button>

      {/* Add + Delete buttons*/}
      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          aria-label="Add"
          className="p-2 rounded bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 inline-flex"
          onClick={() => setShowAdd(true)}
        >
          Add New Student
          <img src={AddIcon} alt="" className="h-5 w-5 ml-2" />
        </Button>

        <Button
          type="button"
          aria-label="Delete"
          onClick={handleDeleteSelected}
          disabled={selectedIds.size === 0}
          className={clsx(
            'p-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 inline-flex items-center justify-center',
            selectedIds.size === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          Delete
          <img src={DeleteIcon} alt="" className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>

    {/* The modal for adding a new student, false at start */}
    <AddModal
      open={showAdd}
      onClose={() => setShowAdd(false)}
      onSave={handleSaveStudent}
    />
    <div className="w-full flex justify-center">
      <div className="overflow-x-auto">
        <table className="table-auto mx-auto bg-white border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 w-10">
                <span className="sr-only">Select</span>
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-700"
                >
                  {column.header}
                </th>
              ))}
              {/* Removed Actions column */}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-300 color-gray-1000">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleOne(row.id)}
                    className="h-4 w-4 rounded bg-white border border-gray-300 accent-blue-600 hover:border-gray-400"
                    aria-label={`Select row ${row.id}`}
                  />
                </td>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-2 px-4 border-b border-gray-300 text-sm text-gray-800 cursor-pointer"
                    onClick={() => openEdit(row)}  // remove this line if you want no editing at all
                  >
                    {Array.isArray(row[column.accessor])
                      ? (row[column.accessor] as string[]).join(', ')
                      : (row[column.accessor] as any)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* page numbers at the bottom */}
        <nav className="mt-4 w-full flex justify-center">
          <ul className="inline-flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <Button
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-3 py-1 rounded border text-sm',
                    page === currentPage
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {page}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>

    <EditStudentModal
      open={editOpen}
      student={editingStudent}
      onClose={() => setEditOpen(false)}
      onSave={handleEditSave}
    />
  </div>
)
}
export default Home;