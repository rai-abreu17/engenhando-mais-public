import React, { useState } from 'react';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  location: string;
}

const initialTeachers: Teacher[] = [
  { id: 1, name: 'John Doe', subject: 'Mathematics', location: 'Room 101' },
  { id: 2, name: 'Jane Smith', subject: 'Science', location: 'Room 102' },
  // ...other initial teachers
];

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Teacher Management</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredTeachers.map(teacher => (
          <li key={teacher.id}>
            {teacher.name} - {teacher.subject} ({teacher.location})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherManagementPage;