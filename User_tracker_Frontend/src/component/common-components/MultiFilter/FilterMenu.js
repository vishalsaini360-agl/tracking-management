import React, { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FILTERACTION } from "./FilterConstant";

const FilterMenu = ({
  chips,
  obj = {},
  isSearching = false,
  selectedListObj = {},
  handleRemoveSearch,
  isAllSelected = false,
  handleAction = false,
}) => {
  const [showList, setShowList] = useState(false);

  const findChipAndReopenDailog = (joinKeyName) => {
    // Removing by iterate over chips arr and find object by joinKey like name_id-portfolio
    let filterValue = chips?.find((chip) => {
      return Array.isArray(chip)
        ? chip[0].joinKey === joinKeyName
        : chip.joinKey === joinKeyName;
    });
    // For open again
    if (Array.isArray(filterValue)) {
      handleAction(filterValue[0], {
        contains: filterValue[0]?.value,
        notContains: filterValue[1]?.value,
        matchCondition: filterValue[0]?.matchCondition || false, // filterValue[1]?.matchCondition is also same
        isExact: filterValue[0]?.isExact,
      });
    } else {
      handleAction(filterValue, {
        condition: filterValue?.condition,
        value: filterValue?.value,
      });
    }
  };

  useEffect(() => {
    if (isSearching) {
      setShowList(isSearching);
    }
  }, [isSearching]);

  return (
    <div className="transition-all cursor-pointer noselect my-1">
      <div
        onClick={(e) => {
          setShowList(!showList);
          e.stopPropagation();
        }}
        className={` text-xs flex justify-between items-center py-1 hover:bg-[#F5F6F7]  ${
          isAllSelected && "bg-[#f5f6f7] hover:bg-[#F5F6F7]"
        }`}
      >
        {obj?.label}
        <div className="mr-2">
          {showList ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>

      {showList &&
        obj?.children?.map((item, index) => {
          return Array.isArray(item?.children) ? (
            <div className="pl-4">
              <FilterMenu key={index} obj={item} />
            </div>
          ) : (
            <div
              key={index}
              className={` text-xs pl-4 py-1 rounded-md my-1 hover:bg-[#F5F6F7] truncate ${
                selectedListObj[item?.key] && "bg-[#f5f6f7] hover:bg-[#F5F6F7]"
              }`}
              onClick={() =>
                selectedListObj[item?.key]
                  ? item?.action === FILTERACTION.SEARCH ||
                    item.action === FILTERACTION.METRIC
                    ? findChipAndReopenDailog(item?.key)
                    : handleRemoveSearch({
                        keyName: item?.key?.split("-")[0], // "name_id" for state searching
                        joinKeyName: item?.key, //"name_id-portfolio"
                      })
                  : handleAction(item)
              }
            >
              {item?.label}
            </div>
          );
        })}
    </div>
  );
};

export default FilterMenu;
