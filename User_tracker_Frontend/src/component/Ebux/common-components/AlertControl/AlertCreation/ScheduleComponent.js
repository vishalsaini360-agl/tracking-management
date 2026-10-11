import React, { useState, useEffect, forwardRef, useRef } from "react";
import { getAlertEmail } from "../services/service";
import ScheduleModal from "./ScheduleModal";
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from "../../../../../tracker";

const ScheduleComponent = forwardRef(({
  alertControlObj,
  setAlertControlObj,
  schedule,
  initSchedule,
  setSchedule,
  edit_alert,
  trackerContext
}, ref) => {
  const [deliveryType, setDeliveryType] = useState(alertControlObj.delivery?.type || "email");
  const [inputValue, setInputValue] = useState("");
  const [recipients, setRecipients] = useState(alertControlObj.delivery?.recipients || []);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tooltipRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setEmailError("");
  }, [deliveryType]);

  useEffect(() => {
    const handleDropdownOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDropdownOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleDropdownOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsTooltipOpen(false);
      }
    };
    if (isTooltipOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isTooltipOpen]);

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await getAlertEmail();
      const rawData = Array.isArray(response) ? response : (response?.data || []);

      if (Array.isArray(rawData)) {
        const emails = rawData.map(user => {
          if (typeof user === 'string') return user;
          return user.email || user.user_email || "";
        }).filter(email => email !== "");
        setEmailSuggestions(emails);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    setAlertControlObj(prev => ({
      ...prev,
      delivery: { type: deliveryType, recipients }
    }));
  }, [deliveryType, recipients, setAlertControlObj]);

  const suggestedEmails = emailSuggestions;

  const suggestedNumbers = [
    "9876543210",
    "9123456789",
    "9988776655",
    "9090909090",
    "7000000000",
  ];

  const suggestions = (deliveryType === "email" ? suggestedEmails : suggestedNumbers).filter(item =>
    !inputValue || item.toLowerCase().includes(inputValue.toLowerCase())
  );

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addRecipient = (value) => {
    if (!value) return;
    if (deliveryType === "email") {
      if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address");
        return;
      }
    }
    trackCustomEvent(
      EVENTS.ADD,
      {
        action: "add_recipient",
        recipient: value,
        delivery_type: deliveryType,
        component: TRACKING_COMPONENT.BUTTON,
      },
      "Schedule Component",
      trackerContext
    );
    setEmailError("");
    if (!recipients.includes(value)) {
      setRecipients([...recipients, value]);
    }
    setInputValue("");
  };

  const removeRecipient = (value) => {
    trackCustomEvent(
      EVENTS.REMOVE,
      {
        action: "remove_recipient",
        recipient: value,
        delivery_type: deliveryType,
        component: TRACKING_COMPONENT.BUTTON,
      },
      "Schedule Component",
      trackerContext
    );
    setRecipients(recipients.filter((item) => item !== value));
  };

  const getInitials = (email) => {
    if (!email) return "";
    const part = email.split("@")[0];
    const names = part.split(/[._-]/);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const getScheduleSummary = () => {
    if (schedule.type === "daily") {
      return "Every day at 09:00 AM IST";
    }
    if (schedule.type === "continuous") {
      return "Every 2 hours";
    }
    const mode = schedule.mode || "weekly";
    if (mode === "weekly") {
      const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const daySummaries = [];
      for (const day of orderedDays) {
        const slots = schedule.weekly?.[day] || [];
        const times = slots.map(s => s.time).filter(Boolean);
        if (times.length > 0) {
          const slotsFormatted = times.map((t, idx) => `T${idx + 1}: ${t}`);
          let timeText = "";
          if (slotsFormatted.length === 1) {
            timeText = slotsFormatted[0];
          } else if (slotsFormatted.length === 2) {
            timeText = `${slotsFormatted[0]} and ${slotsFormatted[1]}`;
          } else {
            timeText = `${slotsFormatted.slice(0, -1).join(", ")} and ${slotsFormatted[slotsFormatted.length - 1]}`;
          }
          daySummaries.push(`${day} (${timeText})`);
        }
      }
      if (daySummaries.length === 0) return "No weekly schedule configured";
      if (daySummaries.length === 1) return daySummaries[0];
      if (daySummaries.length === 2) return `${daySummaries[0]} and ${daySummaries[1]}`;
      return `${daySummaries.slice(0, -1).join(", ")} and ${daySummaries[daySummaries.length - 1]}`;
    } else if (mode === "datewise") {
      const rows = schedule.datewise || [];
      const getDayLabel = (dayVal) => {
        if (!dayVal) return "";
        const day = typeof dayVal === "string" ? new Date(dayVal).getDate() : Number(dayVal);
        if (isNaN(day)) return "";
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
          case 1: return `${day}st`;
          case 2: return `${day}nd`;
          case 3: return `${day}rd`;
          default: return `${day}th`;
        }
      };

      const dateSummaries = [];
      for (const row of rows) {
        if (row.day) {
          const times = (row.times || []).filter(Boolean);
          if (times.length > 0) {
            const slotsFormatted = times.map((t, idx) => `T${idx + 1}: ${t}`);
            let timeText = "";
            if (slotsFormatted.length === 1) {
              timeText = slotsFormatted[0];
            } else if (slotsFormatted.length === 2) {
              timeText = `${slotsFormatted[0]} and ${slotsFormatted[1]}`;
            } else {
              timeText = `${slotsFormatted.slice(0, -1).join(", ")} and ${slotsFormatted[slotsFormatted.length - 1]}`;
            }
            const label = getDayLabel(row.day);
            if (label) {
              dateSummaries.push(`${label} (${timeText})`);
            }
          }
        }
      }
      if (dateSummaries.length === 0) return "No datewise schedule configured";
      if (dateSummaries.length === 1) return dateSummaries[0];
      if (dateSummaries.length === 2) return `${dateSummaries[0]} and ${dateSummaries[1]}`;
      return `${dateSummaries.slice(0, -1).join(", ")} and ${dateSummaries[dateSummaries.length - 1]}`;
    }
    return "Custom schedule";
  };

  const getNextAlertScheduled = () => {
    const now = new Date();
    let closestCandidate = null;

    if (schedule.type === "daily") {
      const candidate = new Date(now);
      candidate.setHours(9, 0, 0, 0);
      if (candidate <= now) {
        candidate.setDate(candidate.getDate() + 1);
      }
      closestCandidate = candidate;
    } else if (schedule.type === "continuous") {
      closestCandidate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    } else if (schedule.type === "custom") {
      const mode = schedule.mode || "weekly";
      if (mode === "weekly") {
        const currentDayIdx = now.getDay();
        for (let offset = 0; offset <= 7; offset++) {
          const targetDayIdx = (currentDayIdx + offset) % 7;
          const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][targetDayIdx];
          const slots = schedule.weekly?.[dayName] || [];
          const times = slots.map(s => s.time).filter(Boolean);

          for (const timeStr of times) {
            const [h, m] = timeStr.split(":").map(Number);
            const candidate = new Date(now);
            candidate.setDate(now.getDate() + offset);
            candidate.setHours(h, m || 0, 0, 0);

            if (candidate > now) {
              if (!closestCandidate || candidate < closestCandidate) {
                closestCandidate = candidate;
              }
            }
          }
        }
      } else if (mode === "datewise") {
        const rows = schedule.datewise || [];
        for (const row of rows) {
          if (!row.day) continue;

          const dateObj = new Date(row.day);
          const isSpecificDate = typeof row.day === "string" && !isNaN(dateObj.getTime()) && row.day.includes("-");

          if (isSpecificDate) {
            const times = (row.times || []).filter(Boolean);
            for (const timeStr of times) {
              const [h, m] = timeStr.split(":").map(Number);
              const candidate = new Date(dateObj);
              candidate.setHours(h, m || 0, 0, 0);
              if (candidate > now) {
                if (!closestCandidate || candidate < closestCandidate) {
                  closestCandidate = candidate;
                }
              }
            }
          } else {
            const dayNum = Number(row.day);
            if (isNaN(dayNum)) continue;

            const times = (row.times || []).filter(Boolean);
            for (const timeStr of times) {
              const [h, m] = timeStr.split(":").map(Number);

              for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
                const candidate = new Date(now.getFullYear(), now.getMonth() + monthOffset, dayNum, h, m || 0, 0, 0);

                if (candidate.getDate() === dayNum && candidate > now) {
                  if (!closestCandidate || candidate < closestCandidate) {
                    closestCandidate = candidate;
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (!closestCandidate) return "No upcoming alerts scheduled";

    // Format Candidate
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(closestCandidate.getFullYear(), closestCandidate.getMonth(), closestCandidate.getDate());
    const diffTime = targetDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let relativeDay = "";
    if (diffDays === 0) {
      relativeDay = "Today, ";
    } else if (diffDays === 1) {
      relativeDay = "Tomorrow, ";
    } else {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      relativeDay = `${days[closestCandidate.getDay()]}, `;
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[closestCandidate.getMonth()];
    const day = closestCandidate.getDate();
    const year = closestCandidate.getFullYear();

    let hours = closestCandidate.getHours();
    const minutes = String(closestCandidate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const timeStr = `${hours}:${minutes} ${ampm}`;

    return `${relativeDay}${monthName} ${day}, ${year} at ${timeStr} IST`;
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto p-2">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-inter font-semibold text-[18px] text-[#0F172A] leading-[100%] tracking-[0px] align-middle">
          Schedule your alert
        </h1>
        <p className="font-inter font-normal text-[14px] text-[#64748B] leading-[100%] tracking-[0px] align-middle pt-1">
          Define when and how you&apos;ll recieve notifications
        </p>
      </div>

      {/* Name & Description */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="font-inter font-medium text-[14px] leading-[100%] tracking-[0] text-[#000000D9]">
            Alert Name
          </label>
          <input
            type="text"
            placeholder="Enter Here"
            value={alertControlObj.name}
            onChange={(e) => setAlertControlObj(prev => ({ ...prev, name: e.target.value }))}
            onBlur={(e) => {
              if (e.target.value?.trim()) {
                trackCustomEvent(
                  EVENTS.INPUT,
                  {
                    action: "alert_name_input",
                    value: e.target.value.trim(),
                    component: TRACKING_COMPONENT.INPUT,
                  },
                  "Schedule Component",
                  trackerContext
                );
              }
            }}
            className="w-full border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-inter font-medium text-[14px] leading-[100%] tracking-[0] text-[#000000D9]">
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="Add notes about this alert..."
            value={alertControlObj.desc}
            onChange={(e) => setAlertControlObj(prev => ({ ...prev, desc: e.target.value }))}
            onBlur={(e) => {
              if (e.target.value?.trim()) {
                trackCustomEvent(
                  EVENTS.INPUT,
                  {
                    action: "alert_description_input",
                    value: e.target.value.trim(),
                    component: TRACKING_COMPONENT.INPUT,
                  },
                  "Schedule Component",
                  trackerContext
                );
              }
            }}
            className="w-full border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Frequency Section */}
      <div className="space-y-4 rounded-2xl opacity-100 gap-2.5 py-2.5 px-4 !bg-[#F9FFFF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] pb-[24px]">
        <h3 className="font-inter font-medium text-base text-[18px] mb-[12px] leading-none tracking-normal align-middletext-[#0F172A]">Frequency</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              trackCustomEvent(
                EVENTS.TOGGLE_BUTTON,
                {
                  action: "select_frequency_type",
                  frequency: "daily",
                  component: TRACKING_COMPONENT.TOGGLE_BUTTON,
                },
                "Schedule Component",
                trackerContext
              );
              setSchedule(prev => ({ ...prev, type: "daily" }));
            }}
            className={`flex flex-col items-start p-5 rounded-2xl border-[0.48px] transition-all text-left ${schedule.type === "daily"
              ? "border-[#0081F7] bg-[#0081F70F]"
              : "border-gray-100 bg-white hover:border-gray-200"
              }`}
          >
            <div className="text-[#000000D9] font-inter font-medium text-base leading-[22px] tracking-normal">Daily</div>
            <div className="pt-[14px] text-[#000000A6] font-inter font-normal text-sm leading-[22px] tracking-normal">
              Alerts are triggered automatically as soon as the defined conditions are met.
            </div>
          </button>
          <div className="relative group">
            <button
              onClick={() => {
                trackCustomEvent(
                  EVENTS.TOGGLE_BUTTON,
                  {
                    action: "select_frequency_type",
                    frequency: "custom",
                    component: TRACKING_COMPONENT.TOGGLE_BUTTON,
                  },
                  "Schedule Component",
                  trackerContext
                );
                trackCustomEvent(
                  EVENTS.POPUP_OPEN,
                  {
                    action: "open_schedule_modal",
                    component: TRACKING_COMPONENT.BUTTON,
                  },
                  "Schedule Component",
                  trackerContext
                );
                setSchedule(prev => ({ ...prev, type: "custom", mode: prev.mode || "weekly" }));
                setIsModalOpen(true);
              }}
              className={`w-full flex flex-col items-start p-5 rounded-2xl border-[0.48px] transition-all text-left h-full ${schedule.type === "custom"
                ? "border-[#0081F7] bg-[#0081F70F]"
                : "border-gray-100 bg-white hover:border-gray-200"
                }`}
            >
              <div className="w-full flex justify-between items-center">
                <div className="text-[#000000D9] font-inter font-medium text-base leading-[22px] tracking-normal">Custom</div>
                <div onClick={(e) => {
                  e.stopPropagation();
                  trackCustomEvent(
                    EVENTS.POPUP_OPEN,
                    {
                      action: "open_schedule_modal",
                      component: TRACKING_COMPONENT.BUTTON,
                    },
                    "Schedule Component",
                    trackerContext
                  );
                  setSchedule(prev => ({ ...prev, type: "custom", mode: prev.mode || "weekly" }));
                  setIsModalOpen(true);
                }} className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="pt-[14px] text-[#000000A6] font-inter font-normal text-sm leading-[22px] tracking-normal">
                Choose a specific day, date, and time to receive alerts whenever the defined conditions are met.
              </div>
            </button>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-2 gap-4 mb-[12px]">
          <div className="bg-[#F4EDFF] border-l-[4px] border-[#C6A4FC] p-4 rounded-r-lg flex flex-col gap-1 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-inter font-medium text-sm leading-none tracking-normal align-middle text-[#0F172A] text-[14px]">Next alert Scheduled</span>
            </div>
            <div className="text-[12px] text-[#64748B] text-[14px] mt-[4px] mb-[10px]">
              {getNextAlertScheduled()}
            </div>
          </div>
          <div className="bg-[#FFF7EC] border-l-[4px] border-[#FFA93A] p-4 rounded-r-lg flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-inter font-medium text-sm leading-none tracking-normal align-middle text-[#0F172A] text-[14px]">Alert Schedule</span>
            </div>
            <div className="text-[12px] text-[#64748B] text-[14px] mt-[4px] mb-[10px]">
              {(() => {
                const summaryText = getScheduleSummary();
                const isTooLong = summaryText.length > 55;
                const displayedText = isTooLong ? `${summaryText.substring(0, 100)}...` : summaryText;
                return (
                  <div className="relative flex items-center gap-1.5 flex-wrap">
                    <span>{displayedText}</span>
                    {isTooLong && (
                      <div className="relative inline-block" ref={tooltipRef}>
                        <button
                          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                          className="text-blue-500 hover:text-blue-600 transition-colors p-0.5 focus:outline-none flex items-center inline-flex"
                          title="Click to view full schedule"
                        >
                          <svg className="w-4 h-4 inline-block align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        {isTooltipOpen && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#0F172A] text-white text-xs rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-1 duration-200">
                            <div className="font-semibold mb-1 text-[11px] uppercase tracking-wider text-blue-400">Alert Schedule</div>
                            <div className="leading-relaxed text-slate-200">{summaryText}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0F172A]"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Section */}
      <div className="space-y-4 rounded-2xl opacity-100 gap-2.5 px-4 !bg-[#F9FFFF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
        <div className="py-2.5">
          <h3 className="font-inter font-medium text-base text-[18px] leading-none tracking-normal align-middletext-[#0F172A] mb-[12px]">Delivery</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                trackCustomEvent(
                  EVENTS.TOGGLE_BUTTON,
                  {
                    action: "select_delivery_type",
                    delivery_type: "email",
                    component: TRACKING_COMPONENT.TOGGLE_BUTTON,
                  },
                  "Schedule Component",
                  trackerContext
                );
                setDeliveryType("email");
              }}
              className={`flex items-center gap-4 p-4 rounded-2xl border-[0.48px] transition-all text-left ${deliveryType === "email"
                ? "border-[#0081F7] bg-[#0081F70F]"
                : "border-gray-100 bg-white hover:border-gray-200"
                }`}
            >
              <div className={`p-2 rounded-lg ${deliveryType === "email" ? "bg-blue-100 text-[#3B82F6]" : "bg-gray-100 text-gray-400"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-[#000000D9] font-inter font-medium text-base leading-[22px] tracking-normal">Email</div>
                <div className="text-[#000000A6] font-inter font-normal text-sm leading-[22px] tracking-normal">Receive alerts via email</div>
              </div>
            </button>
            <button
              disabled
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 bg-white opacity-60 cursor-not-allowed text-left"
            >
              <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="text-[16px] font-bold text-[#111827]">WhatsApp</div>
                <div className="text-[13px] text-[#64748B]">Got notified at WhatsApp</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recipients Section */}
        <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-[30px]">
            <h3 className="text-[14px] font-inter font-medium text-base leading-6 tracking-normal align-middle">Add email recipients for these alerts</h3>
             <div className="relative flex-1 max-w-[300px]" ref={dropdownRef}>
               <input
                 type="text"
                 placeholder="Enter an email"
                 value={inputValue}
                 onChange={(e) => {
                   setInputValue(e.target.value);
                   if (emailError) setEmailError("");
                   setIsDropdownOpen(true);
                 }}
                 onFocus={() => setIsDropdownOpen(true)}
                 onClick={() => setIsDropdownOpen(true)}
                 className="w-full border border-[#E2E8F0] px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                 onKeyDown={(e) => e.key === 'Enter' && addRecipient(inputValue)}
               />
               {emailError && (
                 <span className="text-xs text-red-500 font-medium ml-2 animate-pulse absolute w-full left-[0px] top-[34px]">
                   {emailError}
                 </span>
               )}
               {isDropdownOpen && suggestions.length > 0 && (
                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                   {suggestions.map((item, index) => (
                     <div
                       key={index}
                       onClick={() => {
                         addRecipient(item);
                         setIsDropdownOpen(false);
                       }}
                       className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-none"
                     >
                       {item}
                     </div>
                   ))}
                 </div>
               )}
             </div>
            <button
              onClick={() => addRecipient(inputValue)}
              className="flex items-center gap-2 px-4 py-1.5 border border-[#E2E8F0] text-sm font-bold text-[#475569] hover:bg-gray-50"
            >
              <span>+</span> Add
            </button>

          </div>

          <div className="grid grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2 pb-[24px]">
            {recipients.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-1.5 border border-[#F1F5F9] rounded-full bg-white shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[10px] font-bold text-[#0369A1]">
                  {getInitials(email)}
                </div>
                <span className="text-[11px] font-medium text-[#475569] truncate flex-1">{email}</span>
                <button
                  onClick={() => removeRecipient(email)}
                  className="text-gray-400 hover:text-red-500 pr-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schedule={schedule}
        setSchedule={setSchedule}
        is_edit={!!edit_alert}
        initSchedule={initSchedule}
        innerRef={ref}
        trackerContext={trackerContext}
      />
    </div>
  );
});

ScheduleComponent.displayName = "ScheduleComponent";

export default ScheduleComponent;
