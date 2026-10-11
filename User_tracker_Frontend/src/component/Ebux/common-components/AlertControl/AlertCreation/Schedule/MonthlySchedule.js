import { useState, forwardRef, useImperativeHandle } from "react";
import { TimeInput, IconBtn } from "./ScheduleUI";

const MonthlySchedule = forwardRef(({ value = [], onChange }, ref) => {
    const [errors, setErrors] = useState([]);

    const update = (data) => onChange(data);

    const validate = () => {
        const newErrors = [];
        value.forEach((row, dateIdx) => {
            if (!row.day) {
                newErrors.push({ dateIdx, type: "day", message: "Day is required" });
            }
            row.times.forEach((time, timeIdx) => {
                if (!time) {
                    newErrors.push({
                        dateIdx,
                        timeIdx,
                        type: "time",
                        message: "Time is required"
                    });
                }
            });
        });
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const getError = (dateIdx, timeIdx, type) =>
        errors.find(
            (e) =>
                e.dateIdx === dateIdx &&
                e.type === type &&
                (type === "day" || e.timeIdx === timeIdx)
        );

    const addDateRow = () => {
        if (value.length >= 4) return;
        update([...value, { day: "", times: [""] }]);
    };

    const addDateTime = (dateIdx) => {
        update(
            value.map((row, i) =>
                i === dateIdx && row.times.length < 4
                    ? { ...row, times: [...row.times, ""] }
                    : row
            )
        );
    };

    const removeDateTime = (dateIdx, timeIdx) => {
        const isLastDate = value.length === 1;
        const isLastTime = value[dateIdx].times.length === 1;

        if (isLastDate && isLastTime) return;

        if (isLastTime) {
            update(value.filter((_, i) => i !== dateIdx));
            return;
        }

        update(
            value.map((row, i) =>
                i === dateIdx
                    ? { ...row, times: row.times.filter((_, t) => t !== timeIdx) }
                    : row
            )
        );
    };

    const updateDate = (idx, day) => {
        setErrors(prev => prev.filter(e => !(e.type === "day" && e.dateIdx === idx)));
        update(value.map((row, i) => (i === idx ? { ...row, day } : row)));
    };

    const updateDateTime = (dateIdx, timeIdx, val) => {
        setErrors(prev =>
            prev.filter(e => !(e.type === "time" && e.dateIdx === dateIdx && e.timeIdx === timeIdx))
        );

        update(
            value.map((row, i) => {
                if (i !== dateIdx) return row;
                const isDuplicate = row.times.some((t, idx) => idx !== timeIdx && t === val);
                if (isDuplicate) return row;
                return {
                    ...row,
                    times: row.times.map((t, j) => (j === timeIdx ? val : t))
                };
            })
        );
    };

    const getDayLabel = (day) => {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    useImperativeHandle(ref, () => ({
        handleSave: validate
    }));

    return (
        <div className="space-y-4">
            {value.map((row, dateIdx) => (
                <div key={dateIdx} className="flex flex-wrap items-start gap-3">
                    <div>
                        <select
                            value={row.day || ""}
                            onChange={(e) => updateDate(dateIdx, Number(e.target.value))}
                            className={`px-3 py-2 rounded-lg text-sm bg-[#F9FAFB] border
                ${getError(dateIdx, null, "day") ? "border-red-500" : "border-gray-200"}`}
                        >
                            <option value="" disabled>Select day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1} disabled={value.some((r, idx) => r.day === i + 1 && idx !== dateIdx)}>
                                    {getDayLabel(i + 1)}
                                </option>
                            ))}
                        </select>
                        {getError(dateIdx, null, "day") && (
                            <div className="text-xs text-red-500 mt-1">{getError(dateIdx, null, "day").message}</div>
                        )}
                    </div>

                    {row.times.map((time, timeIdx) => (
                        <div key={timeIdx} className="flex items-start gap-2">
                            <div>
                                <TimeInput
                                    value={time}
                                    disabledTimes={row.times.filter((_, i) => i !== timeIdx)}
                                    onChange={(v) => updateDateTime(dateIdx, timeIdx, v)}
                                />
                                {getError(dateIdx, timeIdx, "time") && (
                                    <div className="text-xs text-red-500 mt-1">{getError(dateIdx, timeIdx, "time").message}</div>
                                )}
                            </div>
                            {!(value.length === 1 && row.times.length === 1) && (
                                <IconBtn danger onClick={() => removeDateTime(dateIdx, timeIdx)}>✕</IconBtn>
                            )}
                        </div>
                    ))}

                    {row.times.length < 4 && (
                        <IconBtn onClick={() => addDateTime(dateIdx)}>＋</IconBtn>
                    )}
                </div>
            ))}
            {value.length < 4 && (
                <IconBtn onClick={addDateRow}>＋ Add Day</IconBtn>
            )}
        </div>
    );
});

MonthlySchedule.displayName = "MonthlySchedule";
export default MonthlySchedule;
