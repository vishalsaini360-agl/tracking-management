import moment from "moment/moment";
import Axios from "axios";
import { addDays } from "date-fns";
import { platformColor } from "./colorConstant";
import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";

let ourRequest = Axios.CancelToken.source();

export const cancelRequest = async () => {
  try {
    await ourRequest.cancel("Request has been cancelled");
    ourRequest = Axios.CancelToken.source();
    return ourRequest;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error, "error");
  }
};

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export const convertDateFormat = (dateToChange) => {
  const d = dateToChange;
  const year = d.getFullYear(); // 2019
  const date = d.getDate();
  const monthIndex = d.getMonth();
  const monthName = months[monthIndex];
  return `${monthName} ${date}, ${year}`;
};


export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const convertDateFormartToMMDDYYYY = (dateToChange) => {
  const convertedDate = moment(dateToChange).format("MM-DD-YYYY");

  if (convertedDate !== "Invalid date") {
    return convertedDate;
  }

  return dateToChange;
};

export const convertDateFormatToDateMonthNameYear = (dateToChange) => {
  let monthIndex;
  if (dateToChange.split("-")[1].split("")[0] == 0) {
    monthIndex = Number(dateToChange.split("-")[1].split("")[1]) - 1;
  } else {
    monthIndex = Number(dateToChange.split("-")[1]) - 1;
  }
  const monthName = months[monthIndex];
  return `${dateToChange.split("-")[2]} ${monthName}, ${
    dateToChange.split("-")[0]
  }`;
};
export const convertDate = (dateToChange) => {
  return moment(dateToChange).format("YYYY-MM-DD");
};
export const scrollToTop = () => {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
};

export const defaultFilterCheck = (accounts, type) => {
  let default_filter_flipkart = localStorage.getItem("default_filter_flipkart");
  let default_filter_blinkit = localStorage.getItem("default_filter_blinkit");
  let default_filter_amazon = localStorage.getItem("default_filter_amazon");
  let default_filter_zepto = localStorage.getItem("default_filter_zepto");
  if (type === "/flipkart") {
    if (
      !default_filter_flipkart ||
      !default_filter_flipkart?.flipkart?.single
    ) {
      let filter = {
        flipkart: {
          single: accounts[0].platform_id,
          multi: accounts.map((account) => account.value),
        },
      };
      localStorage.setItem("default_filter_flipkart", JSON.stringify(filter));
    }
    return JSON.parse(localStorage.getItem("default_filter_flipkart"));
  } else if (type === "/blinkit") {
    if (!default_filter_blinkit) {
      let filter = {
        blinkit: {
          single: accounts[0].platform_id,
          multi: accounts.map((account) => account.value),
        },
      };
      localStorage.setItem("default_filter_blinkit", JSON.stringify(filter));
    }
    return JSON.parse(localStorage.getItem("default_filter_blinkit"));
  } else if (type === "/amazon") {
    if (!default_filter_amazon) {
      let filter = {
        amazon: {
          single: accounts[0].value,
          multi: accounts.map((account) => account.value),
        },
      };
      localStorage.setItem("default_filter_amazon", JSON.stringify(filter));
    }
    return JSON.parse(localStorage.getItem("default_filter_amazon"));
  } else if (type === "/zepto") {
    if (!default_filter_zepto) {
      let filter = {
        zepto: {
          single: accounts[0].platform_id,
          multi: accounts.map((account) => account.value),
        },
      };
      // console.log(accounts,filter,"this ids from helper function")
      localStorage.setItem("default_filter_zepto", JSON.stringify(filter));
    }
    return JSON.parse(localStorage.getItem("default_filter_zepto"));
  }
};

export const defaultDateRange = (item) => {
  let defaultDate = JSON.parse(localStorage.getItem("default_date"));
  if (!defaultDate) {
    let dateRange = {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    };
    localStorage.setItem("default_date", JSON.stringify(dateRange));
  } else {
    if (item !== undefined) {
      defaultDate["startDate"] = item.startDate.toString();
      defaultDate["endDate"] = item.endDate.toString();
      defaultDate["key"] = item.key;
      localStorage.setItem("default_date", JSON.stringify(defaultDate));
    }
  }

  return JSON.parse(localStorage.getItem("default_date"));
};

export const getTextFromReactNode = (node) => {
  if (node === null || node === undefined) return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }

  if (node?.props?.children) {
    return getTextFromReactNode(node.props.children);
  }

  return "";
};
export const copyToClipboard = async (e, text) => {
  e.stopPropagation()
  toast.success("Copied");
  try {
  await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const defaultCompareDate = async (id) => {
  let default_compare_dates = await JSON.parse(
    localStorage.getItem("default_compare_dates")
  );
  if (!default_compare_dates) {
    default_compare_dates = {
      compare_id: "2",
    };
  } else if (id !== undefined) {
    default_compare_dates["compare_id"] = id;
  }
  localStorage.setItem(
    "default_compare_dates",
    JSON.stringify(default_compare_dates)
  );
  return JSON.parse(localStorage.getItem("default_compare_dates"));
};

export const defaultCompareDateBlinkit = (id) => {
  let default_compare_dates = JSON.parse(
    localStorage.getItem("default_compare_dates_blinkit")
  );
  if (!default_compare_dates) {
    default_compare_dates = {
      compare_id: "2",
    };
  } else if (id !== undefined) {
    default_compare_dates["compare_id"] = id;
  }
  localStorage.setItem(
    "default_compare_dates_blinkit",
    JSON.stringify(default_compare_dates)
  );
  return JSON.parse(localStorage.getItem("default_compare_dates_blinkit"));
};

export const hasFilter = (obj) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value) && value.length > 0) {
        return true;
      } else if (typeof value === "object" && hasFilter(value)) {
        return true;
      }
    }
  }
  return false;
};
//LIFE --- TILL FLIPKART MIGRATE TO POSTGRESS

export const getLocalStorageAccounts = () => {
  const savedItems = localStorage.getItem("savedAccounts");
  if (savedItems) {
    return JSON.parse(savedItems);
  } else {
    return [];
  }
};

export function thStyle(column, platform) {
  if (column == "dsa") {
    return {
      borderTop: "none !important",
      borderBottom: "none !important",
      boxShadow: `inset 0px -4px 0 ${platformColor[platform][500]}`,
      background: platformColor[platform][200],
    };
  } else return { borderTop: "" };
}

export const saveLocalStorageAccounts = (items = []) => {
  localStorage.setItem("savedAccounts", JSON.stringify(items));
};

export const dateRangeDropdown = [
  {
    compareId: "2",
    title: "Previous Day Range",
  },
  {
    compareId: "3",
    title: "Previous Month",
  },
  {
    compareId: "4",
    title: "Previous Year",
  },
];

export function areDatesInSameMonthAndYear(startDate, endDate, checkOnlyYear) {
  if (checkOnlyYear) {
    return startDate.getFullYear() === endDate.getFullYear();
  }
  return (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  );
}

export function getCompDates(mainStartDate, mainEndDate, compareId) {
  let startDate;
  let endDate;

  switch (compareId) {
    case "3": {
      startDate = new Date(mainStartDate);
      endDate = new Date(mainEndDate);
      startDate.setMonth(startDate.getMonth() - 1);
      const previousMonth = endDate.getMonth() - 1;
      endDate.setMonth(previousMonth);
      const year = endDate.getFullYear();
      const currentDate = new Date();
      if (new Date(mainEndDate) > currentDate) {
        endDate = new Date(currentDate);
        endDate.setMonth(previousMonth);
      }
      if (
        endDate.getMonth() === previousMonth ||
        year !== new Date(mainStartDate).getFullYear()
      ) {
        endDate.setDate(endDate.getDate());
      } else {
        endDate.setDate(0);
      }
      return {
        startDate,
        endDate,
      };
    }
    case "4": {
      startDate = new Date(mainStartDate);
      endDate = new Date(mainEndDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate.setFullYear(endDate.getFullYear() - 1);
      const currentDate = new Date();
      if (new Date(mainEndDate) > currentDate) {
        endDate = new Date(currentDate);
        endDate.setFullYear(endDate.getFullYear() - 1);
      }
      if (mainEndDate.getDate() === 29 && mainEndDate.getMonth() === 1) {
        endDate.setDate(0);
      }
      return {
        startDate,
        endDate,
      };
    }
    default: {
      endDate = new Date(mainStartDate);
      endDate.setDate(mainStartDate.getDate() - 1);
      const daysDifference =
        Math.floor(
          ((new Date(mainEndDate) > new Date() ? new Date() : mainEndDate) -
            endDate) /
            (24 * 60 * 60 * 1000)
        ) - 1;
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - daysDifference);
      return {
        startDate,
        endDate,
      };
    }
  }
}
