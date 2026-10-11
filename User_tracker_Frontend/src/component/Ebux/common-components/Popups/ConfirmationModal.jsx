import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from '../../../../tracker';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;
    useEffect(() => {
        trackCustomEvent(
            EVENTS.POPUP_OPEN,
            { item: "Confirmation Modal" },
            ENTITY_TYPE.POPUP
        );
        return () => {

            trackCustomEvent(
                EVENTS.POPUP_CLOSE,
                { item: "Confirmation Modal" },
                ENTITY_TYPE.POPUP
            );
        }
    }, [])


    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="bg-white rounded-[28px] p-8 shadow-xl max-w-[320px] w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-10">
                    <h3 className="text-[20px] font-medium text-black leading-snug">
                        {message || "Remove this tag from the selected item?"}
                    </h3>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            trackCustomEvent(
                                EVENTS.CLICK,
                                { item: "Confirmation Modal - Yes" },
                                ENTITY_TYPE.POPUP,
                                {
                                    component_type: TRACKING_COMPONENT.BUTTON
                                }
                            );
                            onConfirm();
                        }}
                        className="flex-1 bg-[#0081F7] hover:bg-[#40a9ff] text-white py-3 rounded-[16px] font-semibold text-[16px] transition-all"
                    >
                        YES
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            trackCustomEvent(
                                EVENTS.CLICK,
                                { item: "Confirmation Modal - No" },
                                ENTITY_TYPE.POPUP,
                                {
                                    component_type: TRACKING_COMPONENT.BUTTON
                                }
                            );
                            onCancel();

                        }}
                        className="flex-1 bg-white hover:bg-gray-50 text-[#595959] border border-[#d9d9d9] py-3 rounded-[16px] font-semibold text-[16px] transition-all"
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
