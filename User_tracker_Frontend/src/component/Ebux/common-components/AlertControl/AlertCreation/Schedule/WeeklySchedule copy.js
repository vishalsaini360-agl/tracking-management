import { Toggle, TimeInput, IconBtn } from "./ScheduleUI";

const DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday"
];

export default function WeeklySchedule({ value = {}, onChange }) {

  const toggleDay = (day) => {
    const enabled = value[day]?.length;
    onChange({
      ...value,
      [day]: enabled ? [] : [{ time: "" }]
    });
  };

  const updateTime = (day, idx, time) => {
    const times = value[day].map((t, i) =>
      i === idx ? { time } : t
    );
    onChange({ ...value, [day]: times });
  };

  const addTime = (day) => {
    if (value[day].length >= 4) return;
    onChange({
      ...value,
      [day]: [...value[day], { time: "" }]
    });
  };

  const removeTime = (day, idx) => {
    onChange({
      ...value,
      [day]: value[day].filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-3">
      {DAYS.map(day => {
        const times = value[day] || [];
        const enabled = times.length > 0;

        return (
          <div key={day} className="flex items-center gap-3">
            <Toggle checked={enabled} onChange={() => toggleDay(day)} />
            <span className="w-24">{day}</span>

            {times.map((t, i) => (
              <div key={i} className="flex gap-2">
                <TimeInput
                  value={t.time}
                  onChange={(v) => updateTime(day, i, v)}
                />
                <IconBtn danger onClick={() => removeTime(day, i)}>✕</IconBtn>
              </div>
            ))}

            {enabled && times.length < 4 && (
              <IconBtn onClick={() => addTime(day)}>＋ Add</IconBtn>
            )}
          </div>
        );
      })}
    </div>
  );
}
