import React, {useEffect} from "react"
import ReactDOM from "react-dom"
import "../styles/Modals.css"

const Modal = ({isOpen, onClose, children, ariaLabel = "Modal"}) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown",onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);
    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => (document.body.style.overflow = prev);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
        className="modal-overlay" 
        role="dialog" 
        aria-label={ariaLabel} 
        onMouseDown={onClose}>
            <div
            className="modal-card"
            onMouseDown={(e) => e.stopPropagation()}
            >
                <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
                >
                    x
                </button>
                <div
                className="modal-content">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
export default Modal;