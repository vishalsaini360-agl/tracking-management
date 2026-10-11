import moment from "moment";
export const samePeriodAsCurrent = (currentPeriod, setPreviousPeriod, label, setActivePreviousFilters) => {
    const { startDate, endDate } = currentPeriod;
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).startOf("day");
    const diffInDays = end.diff(start, "days");
    // console.log("Current Period:", start, end," Diff in days:", diffInDays);

    setPreviousPeriod({
        startDate: start.clone().subtract((diffInDays + 1), "days").toDate(),
        endDate: start.clone().subtract(1, "days").toDate()
    });
    setActivePreviousFilters(label);
};
export const samePeriodLastMonth = (currentPeriod, setPreviousPeriod, label, setActivePreviousFilters) => {
    const { startDate, endDate } = currentPeriod;

    const prevStart = moment(startDate).subtract(1, "month").toDate();
    const prevEnd = moment(endDate).subtract(1, "month").toDate();

    setPreviousPeriod({ startDate: prevStart, endDate: prevEnd });
    setActivePreviousFilters(label);
};
export const samePeriodLastQuarter = (currentPeriod, setPreviousPeriod, label, setActivePreviousFilters) => {
    const { startDate, endDate } = currentPeriod;

    const start = moment(startDate).startOf("day");
    const end = moment(endDate).startOf("day");
    const diffInDays = end.diff(start, 'days');
    const prevStart = moment(startDate).subtract(3, "month").toDate();
    const prevEnd = moment(prevStart).add(diffInDays, "days").toDate();

    setPreviousPeriod({ startDate: prevStart, endDate: prevEnd });
    setActivePreviousFilters(label);
};