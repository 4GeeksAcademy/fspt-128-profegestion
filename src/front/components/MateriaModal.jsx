


import { useEffect, useState } from "react";
import { crearMateria } from "../services/backendService";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const MateriaModal = ({
    show,
    onClose,
}) => {
    const [error, setError] = useState("");
    const [saving, setSaving] = useState("");
    const { store, dispatch } = useGlobalReducer()
    const [materia, setMateria] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (show) {
            setError("");
            setSaving(false);
            setMateria("")
        }
    }, [show]);

    if (!show) return null;

    const handleSave = async () => {
        console.log("funciona");

        setError("");

        if (!materia.trim()) {
            setError("el campo no puede estar vacio")
            return
        }
        setSaving(true);

        const response = await crearMateria()
        if (response.error) {
            setError(response.error)
            setSaving(false)
            return
        }
        dispatch({ type: "auth_set_user", payload: response.user });
        setSaving(false)
        onClose()
        navigate("/dashboard")  
    };

    const handleClose = () => {
        console.log("cierra");
     
        onClose();

    };

    return (
        <>
            <div
                className={`modal ${show ? "show d-block" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
                aria-modal="true"
            >
                <div className="modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title">
                                crea tus materias
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={handleClose}
                                disable={saving}
                            />

                        </div>
                       
                        {error && (
                            <div className="alert alert-danger py-2" role="alert">
                                {error}
                            </div>
                        )}

                        <label className="form-label">Materia</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="matematicas"
                                value={materia}
                                onChange={(e) => setMateria(e.target.value)}
                                disabled={saving}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">

                        <button
                            type="button"
                            className="btn btn -success"
                            onClick={handleSave}
                            disable={saving}
                        >
                            {saving ? (
                                <span className="d-inline-flex align-items-center gap-2"
                                    role="status">
                                    <span className="spinner-border text-light"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>ya queda poco

                                </span>
                            ) : (
                                "entrar"
                            )}
                        </button>

                    </div>

                </div>


            </div>
        </>
    )

}