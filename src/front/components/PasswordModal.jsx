import { useEffect, useState } from "react";
import { changeAlumnoPassword } from "../services/backendService";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const PasswordModal = ({
    show,
    onClose,
}) => {
    const [error, setError] = useState("");
    const [saving, setSaving] = useState("");
    const { store, dispatch } = useGlobalReducer()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (show) {
            setError("");
            setSaving(false);
            setPassword("")
        }
    }, [show]);

    if (!show) return null;

    const handleSave = async () => {
        console.log("funciona");

        setError("");

        if (!password.trim()) {
            setError("Debes completar el campo")
            return
        }
        setSaving(true);

        const response = await changeAlumnoPassword(password)
        if (response.error) {
            setError(response.error)
            setSaving(false)
            return
        }
        dispatch({ type: "auth_set_user", payload: response.user });
        setSaving(false)
        onClose()
        navigate("/alumno")  //vista de calificaciones del alumno
    };

    const handleClose = () => {
        console.log("cierra");
        dispatch({ type: "auth_logout" })
        onClose();

    };

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div
                className={`modal ${show ? "show d-block" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
                aria-modal="true"
            >

                <div className="modal-dialog-centered"> onClick={(e) => e.stopPropagation()}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Bienvenido</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={handleClose}
                                disable={saving}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>al ser tu primera entrada cambia la password</p>
                            {error && (
                                <div className="alert alert-danger py-2" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onsubmit={handleSave}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        minLength="8"
                                        placeholder="********"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={saving}
                                        required
                                    />
                                </div>

                            </form>


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
                </div>

            </div>

        </>
    )

}