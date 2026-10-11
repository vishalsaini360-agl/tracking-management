"use client";
import React from "react";

const CustomModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
        <h2 className="text-xl font-semibold text-gray-800">Session Expiring</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your session is about to expire. Do you want to stay logged in?
        </p>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Logout
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
