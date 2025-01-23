import React from 'react';

function Modal({ isVisible, message, onClose }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">{message}</h2>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Modal;
