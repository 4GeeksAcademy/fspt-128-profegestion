
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

import {
  calificacionRegistro,
  salonesLista,
  listaAlumnos,
  materiasLista
} from "../services/backendService";

export const ModalCalificaciones = ({ show, onClose, recargarCalificaciones }) => {
  const { store, dispatch } = useGlobalReducer();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  const [user, setUser] = useState({
    Salon: "",
    Alumno: "",
    Materia: "",
    Nota: ""
  });

  const [salones, setSalones] = useState([]);
  const [todosAlumnos, setTodosAlumnos] = useState([]);
  const [todasMaterias, setTodasMaterias] = useState([]);


  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  console.log(materiasFiltradas);


  useEffect(() => {
    if (show) {

      setUser({
        Salon: "",
        Alumno: "",
        Materia: "",
        Nota: ""
      });
      setError("");
      setSaving(false);
      setAlumnosFiltrados([]);
      setMateriasFiltradas([]);

      // Traigo salones
      const cargarSalones = async () => {
        const response = await salonesLista();
        if (response.error) {
          setError(response.error);
        } else {
          setSalones(response.data);
        }
      };

      // Traer todos los alumnos
      const cargarAlumnos = async () => {
        const response = await listaAlumnos();
        if (response.error) {
          setError(response.error);
        } else {
          setTodosAlumnos(response.data);
        }
      };

      // Traigo todas las materias
      const cargarMaterias = async () => {
        const response = await materiasLista();
        if (response.error) {
          setError(response.error);
        } else {
          setTodasMaterias(response.data);
        }
      };

      cargarSalones();
      cargarAlumnos();
      cargarMaterias();
    }
  }, [show]);


  useEffect(() => {
    if (user.Salon) {

      const alumnosSalon = todosAlumnos.filter(
        alumno => alumno.salon_id === parseInt(user.Salon)
      );
      setAlumnosFiltrados(alumnosSalon);

      const materiasSalon = todasMaterias.filter(
        materia => materia.salon_id === parseInt(user.Salon)
      );
      setMateriasFiltradas(materiasSalon);

      setUser(prev => ({
        ...prev,
        Alumno: "",
        Materia: ""
      }));
    } else {
      setAlumnosFiltrados([]);
      setMateriasFiltradas([]);
    }
  }, [user.Salon, todosAlumnos, todasMaterias]);

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  if (!show) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      alumno_id: Number(user.Alumno),
      salon_materia_id: Number(user.Materia),
      nota: parseFloat(user.Nota.replace(",", "."))
    };

    console.log("PAYLOAD:", payload);

    const response = await calificacionRegistro(payload);

    if (response.error) {
      setError(response.error);
      setSaving(false);
      return;
    }
    await recargarCalificaciones()
    setSaving(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className={`modal ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        onClick={handleClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registro de calificaciones</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="form-label text-secondary">Salón</label>
                  <select
                    className="form-control form-control-lg"
                    name="Salon"
                    value={user.Salon}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona un salón</option>
                    {salones && salones.map(salon => (
                      <option key={salon.id} value={salon.id}>
                        {salon.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary">Alumno</label>
                  <select
                    className="form-control form-control-lg"
                    name="Alumno"
                    value={user.Alumno}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      {user.Salon ? "Selecciona un alumno" : "Primero selecciona un salón"}
                    </option>
                    {alumnosFiltrados && alumnosFiltrados.map(alumno => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary">Materia</label>
                  <select
                    className="form-control form-control-lg"
                    name="Materia"
                    value={user.Materia}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">
                      {user.Alumno ? "Selecciona una materia" : "Primero selecciona un alumno"}
                    </option>
                    {materiasFiltradas && materiasFiltradas.map(materia => (
                      <option key={materia.salon_materia_id} value={materia.salon_materia_id}>
                        {materia.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary">Nota</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Ingresa la nota"
                    name="Nota"
                    value={user.Nota}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-lg w-100 btn-secondary"
                    onClick={handleClose}
                  >
                    Cerrar
                  </button>

                  <button
                    className="btn btn-lg w-100 text-white shadow-sm"
                    style={{ backgroundColor: "#6200e8" }}
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};