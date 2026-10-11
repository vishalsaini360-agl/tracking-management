import React, { forwardRef, useImperativeHandle } from "react";
import WeeklySchedule from "./WeeklySchedule";
// import MonthlySchedule from "./MonthlySchedule";
import DatewiseSchedule from "./DatewiseSchedule";
import {
  // FrequencyCard, 
  Tab
} from "./ScheduleUI";
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from "../../../../../../tracker";

const ScheduleConfigurator = forwardRef(({ is_edit, initSchedule, value, onChange, trackerContext }, ref) => {
  const { type, mode, weekly, datewise } = value;
  const update = (patch) => onChange({ ...value, ...patch });

  // Refs for validation
  const weeklyRef = React.useRef(null);
  const monthlyRef = React.useRef(null);
  const datewiseRef = React.useRef(null);

  // expose handleSave to parent
  useImperativeHandle(ref, () => ({
    handleSave: () => {
      if (type === "custom") {
        if (mode === "weekly") return weeklyRef.current?.handleSave?.() ?? true;
        if (mode === "monthly") return monthlyRef.current?.handleSave?.() ?? true;
        if (mode === "datewise") return datewiseRef.current?.handleSave?.() ?? true;
      }
      return true;
    }
  }));

  return (
    <div className="space-y-6">
      {/* <div className="space-y-4">
        <label className="text-base font-medium text-[#000000D9]">Frequency <span className="text-red-500">*</span></label>
        <div className="flex gap-4">
          <FrequencyCard
            label="Daily"
            desc="Recommended"
            checked={type === "daily"}
            onChange={() => update({ type: "daily" })}
          />
          <FrequencyCard
            label="Custom"
            desc="Configure schedule for specific days and times"
            checked={type === "custom"}
            onChange={() => update(is_edit && (["weekly", "monthly", "datewise"].indexOf(initSchedule?.mode) > -1) ? { ...initSchedule } : { type: "custom", mode: "weekly" })}
          />
        </div>
      </div> */}

      {type === "custom" && (
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Tab
              active={mode === "weekly"}
              onClick={() => {
                trackCustomEvent(
                  EVENTS.TAB_SWITCH,
                  {
                    action: "switch_schedule_mode_tab",
                    mode: "weekly",
                    component: TRACKING_COMPONENT.TAB,
                  },
                  "Schedule Component",
                  trackerContext
                );
                update(is_edit && initSchedule?.mode === "weekly" ? { ...initSchedule } : { mode: "weekly" });
              }}
            >
              Weekly
            </Tab>
            {/* <Tab active={mode === "monthly"} onClick={() => update(is_edit && initSchedule?.mode === "monthly" ? { ...initSchedule } : { mode: "monthly" })}>
              Monthly
            </Tab> */}
            <Tab
              active={mode === "datewise"}
              onClick={() => {
                trackCustomEvent(
                  EVENTS.TAB_SWITCH,
                  {
                    action: "switch_schedule_mode_tab",
                    mode: "datewise",
                    component: TRACKING_COMPONENT.TAB,
                  },
                  "Schedule Component",
                  trackerContext
                );
                update(is_edit && initSchedule?.mode === "datewise" ? { ...initSchedule } : { mode: "datewise" });
              }}
            >
              Date wise
            </Tab>
          </div>

          <p className="text-xs text-gray-500 italic">
            Maximum 4 time frames can be scheduled.
          </p>

          <div className="!mb-[12px]">
            {mode === "weekly" && (
              <WeeklySchedule
                ref={weeklyRef}
                value={weekly}
                onChange={(weekly) => update({ weekly })}
                trackerContext={trackerContext}
              />
            )}

            {/* {mode === "monthly" && (
              <MonthlySchedule
                ref={monthlyRef}
                value={monthly}
                onChange={(monthly) => update({ monthly })}
                trackerContext={trackerContext}
              />
            )} */}

            {mode === "datewise" && (
              <DatewiseSchedule
                ref={datewiseRef}
                value={datewise}
                onChange={(datewise) => update({ datewise })}
                trackerContext={trackerContext}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ScheduleConfigurator.displayName = "ScheduleConfigurator";
export default ScheduleConfigurator;
