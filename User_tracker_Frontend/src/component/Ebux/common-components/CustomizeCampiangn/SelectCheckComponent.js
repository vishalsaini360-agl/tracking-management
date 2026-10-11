import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

const SelectCheckComponent = ({ kpi, expanded = false, searchValue = "", platform, options, onSelect, selectedOptions }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [filterList, setFilterList] = useState([]);
  useEffect(() => {
    if (searchValue) {
      const newList = options?.filter((obj) => {
        return (
          (!selectedOptions.some((item) => obj.value === item.value && obj.type === item.type)) &&
          obj?.title?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
      });
      setFilterList(newList);
      if (newList.length > 0) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    } else {
      setFilterList(options);
      setIsExpanded(expanded);
    }
  }, [searchValue]);


  const checkNotAllowIn = (option) => {
    let isNotAllow = false;
    if (option?.notAllowWithIsValueIn?.length) {
      for (let index = 0; index < option.notAllowWithIsValueIn.length; index++) {
        isNotAllow = selectedOptions.findIndex((item) => item.value == option.notAllowWithIsValueIn[index]) != -1;
        if (isNotAllow) {
          break;
        }
      }
    }
    return isNotAllow;
  }

  const checkWithAllowIn = (option) => {
    let isNotAllow = false;
    if (option?.allowWithIsValueIn?.length) {
      for (let index = 0; index < option.allowWithIsValueIn.length; index++) {
        isNotAllow = selectedOptions.findIndex((item) => item.value == option.allowWithIsValueIn[index]) == -1;
        if (isNotAllow) {
          break;
        }
      }
    }
    return isNotAllow;
  }
  return (
    <>
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => {
          setIsExpanded(!isExpanded)
          trackCustomEvent(
            EVENTS.CLICK,
            {},
            ENTITY_TYPE.Customize_Column,
            {
              component_type: TRACKING_COMPONENT.BUTTON
            }
          );

        }}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {isExpanded ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">{platform}</div>
        {/* <img src="/assets/images/imp.svg" className="w-[4px]" /> */}
      </div>

      {isExpanded &&
        <ul key={platform + "_ul"} className="space-y-3 px-3 py-2">
          {filterList.map((option, index) =>

            !selectedOptions.some((obj) => obj.value === option.value && obj.type === option.type) && (
              (platform != "Media KPI" && (option?.isDisabled || !option?.allowKPI?.includes(kpi)) ? <></> :
                <li key={platform + index + option?.title} className="flex items-center">
                  <input
                    id={`item${platform + index + option?.title}`}
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedOptions.some((obj) => obj.value === option.value && obj.type === option.type)}
                    onChange={() => {
                      onSelect(option)
                      trackCustomEvent(
                        EVENTS.CHECKBOX,
                        { item: option?.title },
                        ENTITY_TYPE.Customize_Column,
                        {
                          component_type: TRACKING_COMPONENT.CHECKBOX
                        }
                      );

                    }}
                    disabled={(option?.isDisabled) || (platform == "Media KPI") || (!option?.allowKPI?.includes(kpi)) || (checkNotAllowIn(option)) || (checkWithAllowIn(option))}
                  />
                  <label htmlFor={`item${platform + index + option?.title}`} className="ml-3 text-gray-700">{option?.title}</label>
                </li>)


            ))}
        </ul>}

    </>
  );
};

export default SelectCheckComponent;
