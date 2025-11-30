import React from "react";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const DetailsModal = ({ isOpen, onClose, movie = {} }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Movie Quick View">
            <div className="detailsModal">

                <div className="modal-left">
                    <img 
                        className="poster" 
                        src={movie.poster_url} 
                        alt={movie.title || "No Image Available"} 
                    />
                </div>

                <div className="modal-right">
                    <h2 className="modal-title">
                        {movie.title || "Title"}
                    </h2>

                    <p className="modal-meta">
                        {movie.rating ? `Rating: ${movie.rating}` : "Not Yet Rated"}
                    </p>

                    <p className="modal-desc">
                        {movie.description || "No description available"}
                    </p>

                    <div className="modal-actions">
                        <button className="primary-btn">
                            Book Ticket
                        </button>

                        <Link 
                            to={`/review/${movie.id}`} 
                            className="secondary-btn"
                        >
                            View Reviews
                        </Link>
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default DetailsModal;