export const registroProfesor = async(user)=>{


    const response= await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profesor/registro`,{
        method:"POST",
        body: JSON.stringify(user),
        headers:{
         "Content-Type":"application/json"
        }    
    })
    const data = await response.json()   
    if (!response.ok){
        alert("algo salio mal en el registro")
        return data;
    }
    return{ok:true}
   
     
};

export const loginProfesor = async(user)=>{

 const response= await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profesor/login`,{
        method:"POST",
        body: JSON.stringify(user),
        headers:{
         "Content-Type":"application/json"
        }    
    })
    const data = await response.json()   
    if (!response.ok){
        alert("algo salio mal en el registro")
        return data;
    }
       
};



export const editarAlumno =async (user) =>{

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro-estudiante`,{
        method:"PUT",
        body: JSON.stringify(user),
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }

    })
}

export const verifyToken = async (token,dispatch) =>{
    if(!token){
        dispatch( {type: "auth_set_user", payload: null});
        return;
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get_user`,{
        headers:{
            Authorization: `Bearer ${token}`,
        },
    },
);
if (!response.ok){
    dispatch({ type: "auth_logout"});
    return;
}
const user =await response.json();
dispatch({ type: "auth_set_user", payload: user});

}




