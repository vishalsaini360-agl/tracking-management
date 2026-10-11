import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function DiscardModal({ isOpen, onClose, onDiscard }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-[500px] p-10 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Warning Icon */}
                <div className="w-20 h-20 bg-[#FFFBEB] rounded-full flex items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-2xl" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-[32px] font-bold text-[#0F172A] mb-4 tracking-tight">
                    Discard changes?
                </h2>

                {/* Description */}
                <p className="text-[#64748B] text-[18px] leading-relaxed mb-10 max-w-[400px]">
                    You have unsaved changes. Are you sure you want to discard them and return to the alert list?
                </p>

                {/* Actions */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[18px] font-semibold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Keep Editing
                    </button>
                    <button
                        onClick={onDiscard}
                        className="flex-1 px-8 py-4 bg-[#EF4444] text-white rounded-xl text-[18px] font-semibold hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
}
