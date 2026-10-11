import { useState, useRef, useEffect } from "react";

export const Radio = ({ label, desc, checked, onChange }) => (
  <label className="flex gap-2 items-start cursor-pointer">
    <input type="radio" checked={checked} onChange={onChange} />
    <div>
      <div className="text-sm">{label}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  </label>
);

export const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm border rounded-lg transition-colors ${active
      ? "bg-[#EFF6FF] border-[#3B82F6] text-[#1D4ED8] font-medium"
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
  >
    {children}
  </button>
);

export const FrequencyCard = ({ label, desc, checked, onChange, recommended }) => (
  <button
    onClick={onChange}
    className={`flex-1 text-center p-6 border-2 rounded-2xl transition-all ${checked
      ? "border-[#3B82F6] bg-[#F0F7FF]"
      : "border-gray-100 bg-white hover:border-gray-200"
      }`}
  >
    <div className="text-[20px] font-medium text-[#000000D9] mb-2">{label}</div>
    <div className="text-base text-[#000000A6]">{desc}</div>
    {recommended && (
      <div className="text-base text-blue-600 font-medium mt-2">Recommended</div>
    )}
  </button>
);

export const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-10 h-6 rounded-full relative ${checked ? "bg-blue-600" : "bg-gray-300"
      }`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${checked ? "left-5" : "left-0.5"
      }`} />
  </button>
);


export function TimeInput({
  value,
  onChange,
  disabledTimes = []
}) {
  const times = generateTimes();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-[#F9FAFB]"
    >
      <option value="" disabled>
        Select time
      </option>

      {times.map((time) => (
        <option
          key={time}
          value={time}
          disabled={disabledTimes.includes(time)} // ✅ WORKS
        >
          {time}
        </option>
      ))}
    </select>
  );
}

const generateTimes = () => {
  const result = [];
  for (let h = 0; h < 24; h++) {
    result.push(`${String(h).padStart(2, "0")}:00`);
  }
  return result;
};


export const IconBtn = ({ children, onClick, danger, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded ${danger ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
      } ${className}`}
  >
    {children}
  </button>
);


export const DayPicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getDayLabel = (day) => {
    if (!day) return "Select day";
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-sm bg-[#F9FAFB] border w-40 cursor-pointer flex justify-between items-center transition-all
          ${error ? "border-red-500 text-red-500" : "border-gray-200 text-gray-700 hover:border-blue-400"}`}
      >
        <span>{value ? getDayLabel(value) : "Select day"}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] z-[120] w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Select Day of Month</div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => (
              <button
                key={d}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(d);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${value === d
                    ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/30"
                    : "hover:bg-blue-50 text-gray-600 hover:text-[#3B82F6]"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
