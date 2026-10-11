import React, { useRef, useState } from "react";
import _ from "lodash";
import { useCloseWhenClickOutside } from "./useCloseWhenClickOutside";
import "../common-components/selectBox/selectBox.css"
import { saveLocalStorageAccounts } from "../../utils/helpers";

const SelectDropDrown = ({
  // options = [],
  // FilterHeading,
  setSelectedVal,
  selectedVal,
  selectAllDefault,
  disabled,
  setDefault,
  platform,
  options = [{ label: "", value: "" }],
  FilterHeading,
  alignBottom,
}) => {
  // console.log("selectedVal::::::", selectedVal);
  const [showMenu, setShowMenu] = useState(false);
  const [showSelected, setShowSelected] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchVal, setSearchVal] = useState("");
  const dropdownRef = useRef(null);
  React.useEffect(() => {
    if (selectAllDefault == true) {
      selectDefaultAll();
    }
  }, []);
  const selectDefaultAll = async () => {
    let tempName = [];
    let tempVal = [];
    options.map((v) => {
      if (setDefault) {
        if (
          v.label == setDefault ||
          setDefault.includes(v.label) ||
          setDefault.includes(v.value)
        ) {
          // console.log("tempVal::::", tempVal);
          tempName.push(v.label);
          tempVal.push(v.value);
        }
      } else {
        tempName.push(v.label);
        tempVal.push(v.value);
      }
    });
    setSelectedVal([...tempVal]);
    setShowSelected([...tempName]);
  };

  useCloseWhenClickOutside(showMenu, setShowMenu, dropdownRef);

  const selectAll = (e) => {
    let { checked } = e.target;

    let tempName = [];
    let tempVal = [];

    //console.log("selectedVal::::::one",filters);
    if (checked) {
      options?.map((v) => {
        tempName.push(v.label);
        tempVal.push(v.value);
      });
      setSelectedVal([...tempVal]);
      // filters[commonReducer.platFormType.substring(1)]["multi"] = [...tempVal];
      // localStorage.setItem(
      //   FILTER_REPORT[commonReducer.platFormType],
      //   JSON.stringify(filters)
      // );
      saveLocalStorageAccounts(_.map(options, 'value'));
      setShowSelected([...tempName]);
    } else {
      saveLocalStorageAccounts([]);
      setSelectedVal([]);

      // filters[commonReducer?.platFormType?.substring(1)]["multi"] = [];
      // localStorage.setItem(
      //   FILTER_REPORT[commonReducer.platFormType],
      //   JSON.stringify(filters)
      // );
      setShowSelected([]);
    }
    // console.log("selectedVal ww", [...tempName]);
  };

  const getSelected = (e) => {
    let { value, name, checked } = e.target;
    // let orderData = _.filter(options, ele => {
    //   if (checked) {
    //      return [...selectedVal, value].includes(ele.value);
    //   }
    //    const filterArray = _.filter(selectedVal, _ele => _ele !== value);
    //    return filterArray.includes(ele.value);
    // })
    // saveLocalStorageAccounts(_.map(orderData, 'value'));
    if (checked) {
      setSelectedVal([...selectedVal, value]);
      saveLocalStorageAccounts([...selectedVal, value])

      // filters[commonReducer.platFormType.substring(1)]["multi"] = [
      //   ...selectedVal,
      //   value,
      // ];
      // localStorage.setItem(
      //   FILTER_REPORT[commonReducer.platFormType],
      //   JSON.stringify(filters)
      // );
      setShowSelected([...showSelected, name]);
    } else {
      setSelectedVal(selectedVal.filter((item) => item !== value));
      saveLocalStorageAccounts(selectedVal.filter((item) => item !== value))

      // filters[commonReducer.platFormType.substring(1)]["multi"] =
      //   selectedVal.filter((item) => item !== value);

      // localStorage.setItem(
      //   FILTER_REPORT[commonReducer.platFormType],
      //   JSON.stringify(filters)
      // );

      setShowSelected(showSelected.filter((item) => item !== name));
    }
  };
  // console.log("selectedVal", selectedVal, showSelected);
  const borderCss= showMenu? (platform === "ams" ? `amsRing`:platform === "blinkit" ? `blinkitRing`:platform === "instamart" ? `instamartRing`:platform === "zepto" ? `zeptoRing`:"flipkartRing") :""
  
  const checkboxCss=platform === "ams" ? `accent-orange-600`:platform === "blinkit" ? `accent-green-600`:platform === "instamart" ? `accent-pink-800`:platform === "zepto" ? `accent-purple-900`:"accent-blue-600"

  // ${platform==="ams"&&"accent-orange-600"}
  return (
    <>
      <div className="w-full">
        <div className="relative w-full" ref={dropdownRef}>
          <button
            // className="border w-full bg-white px-3 py-1.5 text-sm font-normal text-gray-900  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"

            className={[
              `selectdropdown__box w-full ${borderCss}`,
              showMenu && "flipkart__selectfilter--active",
            ].join(" ")}
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {selectedVal?.length > 0 ? (
              <div className="row justify-between items-center ">
                {showSelected.length === options.length
                  ? `All Selected (${showSelected.length})`
                  : showSelected.join(", ")}
              </div>
            ) : (
              <>
                <div className="row justify-between items-center">
                  <div>{FilterHeading}</div>
                  <div className="px-4 inline-block">
                    <img src="/assets/images/down-drop.svg" alt="" />
                  </div>
                </div>
              </>
            )}

            {/* <img src="/assets/images/down-drop.svg"/> */}
          </button>
          {showMenu && !disabled && (
            <>
              <div
                className={
                  alignBottom
                    ? "top-full left-0 w-full  border border-r-6 bg-white z-50"
                    : "absolute top-full left-0 w-full  border border-r-6 bg-white z-50"
                }
              >
                {/* <div className="pb-2 ">
                  <input
                    placeholder="Search"
                    className="searchbar "
                    onChange={takeSearchVal}
                    value={searchVal}
                  />
                </div> */}

                <ul className="dropdowOptionsul ">
                  <li className="pb-0.5 group">
                    <div
                      className={[
                        "dropdownoptionsulLable ",
                        showSelected.length === options.length &&
                          "dropdownoptionsulLable--active",
                        platform === "blinkit" &&
                          "dropdownoptionsulLable--blinkit ",
                        platform === "ams" && "dropdownoptionsulLable--ams",
                        platform === "instamart" && "dropdownoptionsulLable--instamart",
                        platform === "zepto" && "dropdownoptionsulLable--zepto",
                      ].join(" ")}
                    >
                      <label className="p-2 w-full cursor-pointer block font-semibold pl-4">
                        <input
                          // name={val.label}
                          // value={val.value}
                          type={"checkbox"}
                          onChange={(e) => selectAll(e)}
                          checked={showSelected.length === options.length}
                          className={checkboxCss}
                        />

                        <label className="ml-1 group-hover:text-white">{"Select all"}</label>
                      </label>
                    </div>
                  </li>
                  {options?.map((val) => {
                    return (
                      <>
                        {val?.label?.startsWith(searchVal) && (
                          <li className="pb-0.5 group">
                            <div
                              className={[
                                "dropdownoptionsulLable ",
                                showSelected.includes(val.label) &&
                                  "dropdownoptionsulLable--active",
                                platform === "blinkit" &&
                                  "dropdownoptionsulLable--blinkit",
                                platform === "ams" &&
                                  "dropdownoptionsulLable--ams",
                                platform === "instamart" &&
                                  "dropdownoptionsulLable--instamart",
                                platform === "zepto" &&
                                  "dropdownoptionsulLable--zepto",
                              ].join(" ")}
                            >
                              <label className="p-2 w-full cursor-pointer block font-medium pl-4 group-hover:text-white">
                                <input
                                  name={val.label}
                                  value={val.value}
                                  type={"checkbox"}
                                  onChange={(e) => getSelected(e)}
                                  checked={showSelected.includes(val.label)}
                                  className={`mr-1 ${checkboxCss}`}
                                />
                                {val.label}
                              </label>
                            </div>
                          </li>
                        )}
                      </>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectDropDrown;
