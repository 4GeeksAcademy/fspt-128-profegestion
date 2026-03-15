import React from "react";
import StudentRow from "./StudentRow";
import "../styles/dashboard.css";

export default function StudentTable({ students }) {

  return (
    <table className="students-table">
      <thead>
        <tr>
          <th>Alumno</th>
          <th>Salón</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {students.map(student => (
          <StudentRow key={student.id} student={student} />
        ))}
      </tbody>
    </table>
  );
}
