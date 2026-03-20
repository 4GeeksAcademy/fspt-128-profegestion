import React, { useState } from "react";
import { eliminarAlumno, verifyToken } from "../services/backendService"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export default function StudentRowA({ student }) {

    const [loading, setLoading] = useState(false);
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate()

    const handleSend = (studentID) => {
        eliminarAlumno(studentID)
        verifyToken(dispatch, navigate)
    }


    return (
        <tr>
            <td>{student.nombre}</td>
            <td>{student.salon}</td>
            <td>

                <button
                    className="btn-primary"
                    onClick={() => handleSend(student.id)}
                    disabled={loading}
                >
                    Borrar
                </button>


            </td>
        </tr>
    );
}

