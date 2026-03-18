import React from "react";
import StudentRowA from "./StudentRowA";
import "../styles/dashboard.css";

export default function StudentAula({ students }) {

  return (
    <table className="students-table">
      <thead>
        <tr>
          <th>Alumno</th>
          <th>Salón</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {students.map(student => (
          <StudentRowA key={student.id} student={student} />
        ))}
      </tbody>
    </table>
  );
}
