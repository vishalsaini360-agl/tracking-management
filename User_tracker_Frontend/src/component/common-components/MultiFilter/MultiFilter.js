import "./style.css";
import React, { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FILTERACTION } from "./FilterConstant";
import FilterDailog from "./FilterDailog";
import SearchDailog from "./SearchDailog";
import MetricDailog from "./MetricDailog";
import SearchChip from "./SearchChip";
import MetricChip from "./MetricChip";
import SaveSearchDailog from "./SaveSearchDailog";
import DeleteDailog from "../Popups/DeleteDailog";

const MultiFilter = ({
  arr = [],
  defaultValue = false,
  savedSearch = {},
  handleSaveFilters = false,
  applySearchFilter = false,
  platform = "ams",
}) => {
  const [chips, setChips] = useState([]);
  const [listArr, setListArr] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState({}); // To store values of search filter
  const [selectedListObj, setSelectedListObj] = useState({}); // To store values of search filter
  const [showFilter, setShowFilter] = useState(false); // To show filter list below search bar
  const [showSaveSearchDailog, setShowSaveSearchDailog] = useState(false);

  const [searchDailogObj, setSearchDailogObj] = useState({
    // To show search dailog
    show: false,
    obj: {},
    value: {},
  });
  const [metricDailogObj, setMetricDailogObj] = useState({
    // To show metric dailog
    show: false,
    obj: {},
    value: {},
  });
  const [deleteDailogObj, setDeleteDailogObj] = useState({
    // To show delete dailog
    show: false,
    obj: {},
  });

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const clearAllValues = () => {
    setSearchText(""); // Clear input search text
    createSearchAndSelectedFilter(arr); // It will create search and selected filter at blank state
    setChips([]); // Clear all chips
  };

  const handleSearch = (searchFilter, keyName, joinKeyName = "") => {
    let currentKey =
      keyName === "name_id" ? joinKeyName.split("-")[1] : keyName;
    applySearchFilter && applySearchFilter(searchFilter, currentKey);
  };

  const handleValueChange = (keyName, joinKeyName, filter, type) => {
    //name_id --> keyName To find state
    let newSearchFilter;
    if (type === FILTERACTION.SEARCH) {
      newSearchFilter = {
        ...searchFilter,
        [keyName]: [...searchFilter[keyName], ...filter], // filter is array in case of search
      };
    }
    if (
      type === FILTERACTION.METRIC ||
      type === FILTERACTION.APPLY ||
      type === FILTERACTION.TAG
    ) {
      newSearchFilter = {
        ...searchFilter,
        [keyName]: [...searchFilter[keyName], filter], // filter is array in case of metric
      };
    }
    setSearchFilter(newSearchFilter);

    //name_id-portfolio --> joinKeyName To add new unique key for selected list obj
    const newSelectedListObj = {
      ...selectedListObj,
      [keyName]: { ...selectedListObj[keyName], [joinKeyName]: true },
    };
    setSelectedListObj(newSelectedListObj);

    setChips((prev) => [...prev, filter]);

    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleValueUpdate = (keyName, joinKeyName, filter) => {
    let newSearchFilter; //name_id --> keyName To find state

    const prevSearchArr = [...searchFilter[keyName]]; // Removing values from search filter state -> name_id

    let filterArr = prevSearchArr?.filter((obj) => {
      return obj?.joinKey !== joinKeyName;
    });
    if (Array.isArray(filter)) {
      filterArr = [...filterArr, ...filter]; //Add new updated values in array
    } else {
      filterArr = [...filterArr, filter]; //Add new updated values in array
    }
    newSearchFilter = { ...searchFilter, [keyName]: filterArr };
    setSearchFilter(newSearchFilter);

    //Remove old chips
    let filterChipsArr = chips?.filter((chip) => {
      return Array.isArray(chip)
        ? chip[0].joinKey !== joinKeyName
        : chip.joinKey !== joinKeyName;
    });
    filterChipsArr = [...filterChipsArr, filter]; // Update chips with new one
    setChips(filterChipsArr);

    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleApplySavedSearch = (data) => {
    if (chips.length > 0) clearAllValues(); // If search already present then clear everything

    let searchFilterJson = JSON.parse(data);

    let savedSearchStates = {}; // To create saved search selected list filter to check if filter removed of savedSearch
    let newSelectedListObj = {}; // To create selected list obj out of saved search filter json
    const chipArr = [];
    const uniqueNameIds = {};

    Object.keys(searchFilterJson)?.map((key) => {
      let valueObj = {};

      // Used for chips
      if (key === "name_id") {
        searchFilterJson[key]?.forEach((obj) => {
          if (uniqueNameIds[obj?.joinKey]) {
            uniqueNameIds[obj?.joinKey].push(obj);
          } else {
            uniqueNameIds[obj?.joinKey] = [obj];
          }
        });
      }

      searchFilterJson[key]?.forEach((obj) => {
        valueObj[obj?.joinKey] = true;
        if (key !== "name_id") {
          chipArr.push(obj); // Used for chips
        }
      });

      newSelectedListObj[key] = valueObj;
      if (Object.keys(valueObj).length > 0) {
        savedSearchStates[key] = valueObj;
      }
    });

    setSelectedListObj(newSelectedListObj);
    setSearchFilter(searchFilterJson);
    chipArr.push(...Object.values(uniqueNameIds));
    setChips(chipArr);

    // To get current priority key for handleSearch
    const priorityObj = { ...newSelectedListObj };
    delete priorityObj["name_id"];
    let maxLength = -1;
    let priorityKey = "portfolio_m";
    Object.keys(priorityObj)?.forEach((key) => {
      const objLength = Object.keys(priorityObj[key]).length;
      if (objLength > maxLength) {
        priorityKey = key;
        maxLength = objLength;
      }
    });

    handleSearch(searchFilterJson, priorityKey);
  };

  // For campaign sp, sb like filters
  const handleDirectListApply = (obj) => {
    const pKey = obj?.key.split("-")[0]; //"amazon_campaign_type"
    const key = obj?.key.split("-")[1]; // The key is seperated here "SP"
    const joinKey = obj?.key; // That's why we created join key which depicts key feaure of list like 'amazon_campaign_type-SP'
    const filterObj = {
      pkey: pKey,
      key: key,
      value: key,
      joinKey: joinKey,
      condition: "contains",
      label: obj?.data?.split("-")[0], // For chips title
      action: obj?.action, // For open search dailog again when clicking on chips
    };

    handleValueChange(pKey, joinKey, filterObj, obj?.action);
  };

  // For campaign sp, sb like filters
  const handleDirectTagApply = (obj) => {
    const pKey = obj?.key.split("-")[0]; //"amazon_campaign_type"
    const key = obj?.key.split("-")[1]; // The key is seperated here "SP"
    const joinKey = obj?.key; // That's why we created join key which depicts key feaure of list like 'amazon_campaign_type-SP'
    const filterObj = {
      pkey: pKey,
      key: key,
      joinKey: joinKey,
      label: obj?.label, // For chips title
      action: obj?.action, // For open search dailog again when clicking on chips
    };

    handleValueChange(pKey, joinKey, filterObj, obj?.action);
  };

  // --------------------------------------------------------------------

  const handleRemoveSearch = ({ keyName, joinKeyName }) => {
    // keyName-->"name_id" for searching state in search filter
    // joinKeyName--> "name_id-portfolio" find object for replacing or removing
    // Removing values from selected saved search filter obj to remove saved search chip

    handleRemoveFromSearchFilter(keyName, joinKeyName);
    handleRemoveFromSelectedList(keyName, joinKeyName);
    handleRemoveFromChips(joinKeyName);
  };

  const handleRemoveFromChips = (joinKeyName) => {
    // Removing by iterate over chips arr and find object by joinKey like name_id-portfolio
    let filteredList = chips?.filter((chip) => {
      return Array.isArray(chip)
        ? chip[0].joinKey !== joinKeyName
        : chip.joinKey !== joinKeyName;
    });

    setChips(filteredList);
  };

  const handleRemoveFromSearchFilter = (keyName, joinKeyName) => {
    // Removing values from search filter state
    const prevSearchArr = [...searchFilter[keyName]]; // Get previous value like {"name_id": [{},{},{}] } ==> return [{},{},{}]
    const filterArr = prevSearchArr?.filter((obj) => {
      return obj?.joinKey !== joinKeyName; // we have joinKey on search filter values
    });

    const newSearchFilter = { ...searchFilter, [keyName]: filterArr };

    setSearchFilter(newSearchFilter);
    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleRemoveFromSelectedList = (keyName, joinKeyName) => {
    //Removing values from selected list obj state
    const selectedKeyObj = { ...selectedListObj[keyName] }; // { name_id: { "name_id-portfolio": true }} => return { "name_id-portfolio": true }
    delete selectedKeyObj[joinKeyName]; // {} Remove values from object
    setSelectedListObj((prevObj) => ({
      ...prevObj,
      [keyName]: selectedKeyObj,
    }));
  };

  // -----------------------------------------------------------------

  const handleFilterAction = (obj, value = false) => {
    if (searchText) {
      setSearchText(""); //If search text available then empty
    }
    if (obj?.action === FILTERACTION.METRIC) {
      setMetricDailogObj({ show: true, obj, value });
    }
    if (obj?.action === FILTERACTION.SEARCH) {
      setSearchDailogObj({ show: true, obj, value });
    }
    if (obj?.action === FILTERACTION.APPLY) {
      handleDirectListApply(obj);
      return; // We don't want to close filter box in case of apply action
    }
    if (obj?.action === FILTERACTION.TAG) {
      handleDirectTagApply(obj);
      return; // We don't want to close filter box in case of apply action
    }
    handleCloseFilter();
  };

  // ------------------------------------- Do not modify join or map functions--------------------------------

  const handleJoinList = (arr) => {
    // To join parent's label and key to children by handleMapParent function
    const newArr = arr?.map((obj) => {
      return obj.join ? handleMapParent(obj) : obj;
    });
    setListArr(newArr);
  };

  //For mapping parent label and key with children
  const handleMapParent = (mapObj) => {
    const newChildrenArr = mapObj?.children?.map((obj) => {
      let newObj = {
        ...obj,
        key: `${mapObj?.key}-${obj?.key}`,
        data: `${mapObj?.label} - ${obj?.label}`,
      };
      return newObj;
    });
    const newObj = { ...mapObj, children: newChildrenArr };
    return newObj;
  };

  // ---------------------------------------------------------------------------------------------------------

  const createSearchAndSelectedFilter = (arr) => {
    // To create search filter, selected list obj state at mounting
    let searchFilterObject = {};
    let selectedListObject = {};
    arr.forEach((obj) => {
      searchFilterObject[obj?.key] = [];
      selectedListObject[obj?.key] = {};
    });

    setSelectedListObj(selectedListObject);
    setSearchFilter(searchFilterObject);
  };

  useEffect(() => {
    if (arr.length > 0) {
      handleJoinList(arr); // Run for all objects which have join key true in json
      createSearchAndSelectedFilter(arr, savedSearch); // It will create search and selected filter state
    }
  }, [arr]);

  // ------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Assuming you can identify the popover element by class or other means
      if (showFilter && !event.target.closest("#filter-container")) {
        setShowFilter(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilter]);

  useEffect(() => {
    if (defaultValue?.length > 2) {
      // eslint-disable-next-line no-console
      handleApplySavedSearch(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex bg-white py-2.5 pl-2" id="multi-filter">
      <div className=" flex-1 flex items-center gap-2 flex-wrap">
        <div className="pl-2">
          <HiOutlineMagnifyingGlass />
        </div>
        {chips?.map((chip, index) => {
          return Array.isArray(chip) ? (
            <SearchChip
              arr={chip}
              key={index}
              handleAction={handleFilterAction}
              handleRemoveSearch={handleRemoveSearch}
            />
          ) : (
            <MetricChip
              obj={chip}
              handleAction={handleFilterAction}
              handleRemoveSearch={handleRemoveSearch}
              clearAllValues={clearAllValues}
            />
          );
        })}

        {deleteDailogObj?.show && (
          <DeleteDailog
            heading={`Delete ${deleteDailogObj?.obj?.label} ?`}
            text="This will permanently delete your saved search from our servers."
            handleClose={() =>
              setDeleteDailogObj({
                show: false,
                obj: {},
              })
            }
          />
        )}

        {showSaveSearchDailog && (
          <SaveSearchDailog
            searchFilter={searchFilter}
            clearAllValues={clearAllValues}
            handleSave={handleSaveFilters}
            handleClose={() => setShowSaveSearchDailog(false)}
            platform={platform}
          />
        )}

        {metricDailogObj?.show && (
          <MetricDailog
            platform={platform}
            dailogObj={metricDailogObj?.obj}
            reopenData={metricDailogObj?.value}
            setChips={setChips}
            setSearchFilter={setSearchFilter}
            handleValue={handleValueChange}
            handleValueUpdate={handleValueUpdate}
            setSelectedListObj={setSelectedListObj}
            handleClose={() => setMetricDailogObj({ show: false, obj: {} })}
          />
        )}
        {searchDailogObj?.show && (
          <SearchDailog
            platform={platform}
            dailogObj={searchDailogObj?.obj}
            reopenData={searchDailogObj?.value}
            setChips={setChips}
            setSearchFilter={setSearchFilter}
            handleValue={handleValueChange}
            handleValueUpdate={handleValueUpdate}
            setSelectedListObj={setSelectedListObj}
            handleClose={() => setSearchDailogObj({ show: false, obj: {} })}
          />
        )}

        <div className="relative" id="filter-container">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowFilter(true)}
            placeholder="Search and filter"
            className="flex w-[310px] rounded-full border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {showFilter && (
            <FilterDailog
              chips={chips}
              listArr={listArr}
              searchText={searchText}
              savedSearch={savedSearch}
              handleDeleteSavedSearch={setDeleteDailogObj}
              handleAction={handleFilterAction}
              handleSavedAction={handleApplySavedSearch}
              handleRemoveSearch={handleRemoveSearch}
              selectedListObj={selectedListObj}
            />
          )}
        </div>
      </div>
      {handleSaveFilters && (
        <button
          className="px-2 font-semibold text-blue-400"
          onClick={() => {
            chips.length > 0 && setShowSaveSearchDailog(true);
          }}
        >
          Save
        </button>
      )}
      <button className="px-2 font-semibold" onClick={clearAllValues}>
        Cancel
      </button>
    </div>
  );
};

export default MultiFilter;
