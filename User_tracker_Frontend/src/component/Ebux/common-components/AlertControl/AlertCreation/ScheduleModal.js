import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ScheduleConfigurator from './Schedule/ScheduleConfigurator';
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from '../../../../../tracker';

export default function ScheduleModal({
  isOpen,
  onClose,
  schedule,
  setSchedule,
  is_edit,
  initSchedule,
  innerRef,
  trackerContext
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-fit min-w-[1250px] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="px-8 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0F172A]">Create Schedule</h2>
          <button
            onClick={() => {
              trackCustomEvent(
                EVENTS.POPUP_CLOSE,
                {
                  action: "close_schedule_modal",
                  component: TRACKING_COMPONENT.BUTTON,
                },
                "Schedule Component",
                trackerContext
              );
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-2 overflow-y-auto min-h-[450px] max-h-[70vh]">
          <ScheduleConfigurator
            value={schedule}
            is_edit={is_edit}
            initSchedule={initSchedule}
            onChange={setSchedule}
            ref={innerRef}
            hideFrequencyToggle={true}
            trackerContext={trackerContext}
          />
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={() => {
              trackCustomEvent(
                EVENTS.CANCEL,
                {
                  action: "cancel_schedule_modal",
                  component: TRACKING_COMPONENT.BUTTON,
                },
                "Schedule Component",
                trackerContext
              );
              onClose();
            }}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              trackCustomEvent(
                EVENTS.APPLY,
                {
                  action: "apply_schedule_modal",
                  component: TRACKING_COMPONENT.BUTTON,
                },
                "Schedule Component",
                trackerContext
              );
              if (innerRef.current?.handleSave()) {
                onClose();
              }
            }}
            className="px-8 py-2.5 bg-[#3B82F6] text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
