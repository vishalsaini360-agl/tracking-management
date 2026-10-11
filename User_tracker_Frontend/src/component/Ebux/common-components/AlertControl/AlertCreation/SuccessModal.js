import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function SuccessModal({ isOpen, onClose,
    // onCreateAnother, 
    nextRunDate }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-[500px] p-10 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Success Icon */}
                <div className="w-20 h-20 bg-[#F0F7FF] rounded-full flex items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} className="text-white text-2xl" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-[32px] font-bold text-[#0F172A] mb-4 tracking-tight">
                    Alert Activated
                </h2>

                {/* Description */}
                <p className="text-[#64748B] text-[18px] leading-relaxed mb-10 max-w-[400px]">
                    Your alert is now active and monitoring. You’ll receive your first alert on <span className="text-[#0F172A] font-semibold">{nextRunDate || "selected schedule"}</span>
                </p>

                {/* Actions */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[18px] font-semibold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Close
                    </button>
                    {/* <button
                        onClick={onCreateAnother}
                        className="flex-1 px-8 py-4 bg-[#3B82F6] text-white rounded-xl text-[18px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
                    >
                        Create Another
                    </button> */}
                </div>
            </div>
        </div>
    );
}
