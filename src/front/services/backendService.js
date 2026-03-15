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
};

export const registroAlumno = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/alumno/registro`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
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

export const verifyToken = async (token, dispatch) => {
  if (!token) {
    dispatch({ type: "auth_set_user", payload: null });
    return;
  }
  //SI local.storage.getItem("role") == "alumno" hago la peticion para get_alumno
  //ELSE hago la peticion a get_profesor
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/get_user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    dispatch({ type: "auth_logout" });
    return;
  }
  const user = await response.json();
  dispatch({ type: "auth_set_user", payload: user });
};


export const crearMateria = async (materia,token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/materias/crear`,
    {
      method: "POST",
      body: JSON.stringify(),     
        nombre: materia ,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    },
  );
  const data = await response.json();
  console.log(data);
  
  if (!response.ok) {
    alert("algo salio mal en el registro");
    return data;
  }
  return data;
};