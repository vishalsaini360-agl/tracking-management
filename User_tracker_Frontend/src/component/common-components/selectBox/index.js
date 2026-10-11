import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import "./selectBox.css";
const SelectBox = ({
  label,
  options,
  applyFilters,
  defaultSelected,
  filterName,
  unSelectDefault,
  platform,
  isBlinkitTag = false
}) => {
  const [selected, setSelected] = useState([]);
  // console.log("defaultSelected:::::::::::::::custom", defaultSelected);
  function setFilter(e) {
    let values = [];
    setSelected(e);
    e.map((val) => {
      values.push(val.value);
    });
    // console.log("values::::", values);

    if (filterName === "brand") {
      if (platform == "ams" || platform == "zepto") {
        let lables = [];

        setSelected(e);

        e.map((val) => {
          // console.log("labelssssssssssss:::::::::::::::", val);
          lables.push(val.label);
        });
        // let filters = JSON.parse(localStorage.getItem("default_filter_amazon"));
        // filters["amazon"]["multi"] = values;
        // localStorage.setItem("default_filter_amazon", JSON.stringify(filters));
      } else {
        let filters = JSON.parse(
          localStorage.getItem("default_filter_flipkart")
        );
        filters["flipkart"]["multi"] = values;
        localStorage.setItem(
          "default_filter_flipkart",
          JSON.stringify(filters)
        );
      }
    }

    if (filterName === "types" && platform === "blinkit") {
      let filters = JSON.parse(localStorage.getItem("default_filter_blinkit"));
      filters["blinkit"]["multi"] = values;
      localStorage.setItem("default_filter_blinkit", JSON.stringify(filters));
    }

    applyFilters(filterName, values);
  }
  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      selected.map(({ label }) => selectedLabels.push(label));
    }
    return selectedLabels.join(",");
  };
  useEffect(() => {
    if (!unSelectDefault) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);
  return (
    <div className="relative">
      {/* <label className="absolute -top-4 left-0 bg-white z-10 text-gray-600">{label}</label> */}
      <MultiSelect
        className={[
          "rmsc",
          platform === "flipkart" && "textPadding",
          platform === "ams" && "rmsc--ams",
          platform === "blinkit" && "rmsc--blinkit",
          platform === "zepto" && "rmsc--zepto",
          platform === "instamart" && "rmsc--insta",
          isBlinkitTag && "rmsc--blinkit--dropdown"
        ].join(" ")}
        options={options}
        value={selected}
        onChange={setFilter}
        labelledBy="Select Label"
        ClearSelectedIcon={null}
        disableSearch={true}
        valueRenderer={customValueRenderer}
        overrideStrings={{ selectSomeItems: label }}
        // isOpen={true}
      />
    </div>
  );
};

export default SelectBox;
