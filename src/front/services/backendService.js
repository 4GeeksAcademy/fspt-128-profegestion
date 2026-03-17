import { Materias } from "../pages/Materias";
import storeReducer from "../store";

export const registroProfesor = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/profesor/registro`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    alert("algo salio mal en el registro");
    return data;
  }
  return { ok: true };
};

export const loginProfesor = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/profesor/login`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    alert("algo salio mal en el registro");
    return data;
  }
  return data;
};

export const registroAlumno = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/alumno/registro`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    return { error: data.msg };
  }
  return data;
};

export const loginAlumno = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/alumno/login`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    alert("algo salio mal en el registro");
    return data;
  }
  return data;
};

export const changeAlumnoPassword = async (newPassword) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/alumno/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        new_password: newPassword,
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    return { error: data.msg };
  }
  return data;
};

export const verifyToken = async (dispatch, navigate) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || !role) {
    dispatch({ type: "auth_logout" });
    navigate("/");
    return;
  }
  //SI local.storage.getItem("role") == "alumno" hago la peticion para get_alumno
  //ELSE hago la peticion a get_profesor
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/perfil/${role == "teacher" ? "profesor" : "alumno"}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    dispatch({ type: "auth_logout" });
    navigate("/");
    return;
  }
  const user = await response.json();
  dispatch({ type: "auth_set_user", payload: user });
};

export const crearMateria = async (materia) => {
  console.log(materia);

  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/materias/crear`,
    {
      method: "POST",
      body: JSON.stringify(materia),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    alert("algo salio mal en el registro");
  }
  return data;
};
