/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SelectDropDrown from "../SelectDropDown";
import DatePicker from "../../DatePicker";
import Button from "../button/Button";
import CustomSelect from "../CustomSelect";
import {
  GET_ACCOUNTS,
  GET_ZEPTO_ACCOUNTS,
  INSTAMART_BRANDS,
} from "../../../utils/constants";
import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";
import { _GET } from "../../../services/axios.method";
import { defaultFilterCheck, getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../utils/helpers";
import _ from "lodash";
const OptionsHeader = ({
  onChangeDate,
  dateRange,
  setDateRange,
  calState,
  setCalState,
  applyDate,
  cancelDate,
  dashboard,
  setSelectedAccountVal,
  selectedAccountVal,
  setSelectedPlatformVal,
  selectedPlatformVal,
  setSelectedTypeVal,
  selectedTypeVal,
  applybtn,
  setBrandOptions,
  platform
}) => {
  // const brandOptionData = [
  //   { label: "Moov", value: "Moov" },
  //   { label: "Dettol", value: "Dettol" },
  //   { label: "Durex", value: "Durex" },
  //   { label: "Veet", value: "Veet" },
  // ];

  const [brandDataListing, setBrandDataListing] = useState([]);
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [portfolioOptionData, setportfolioOptionData] = useState([]);
  const brandOption = [
    { label: "Reach", value: "Reach" },
    { label: "Performance", value: "Performance" },
  ];
  const commonReducer = useSelector((state) => state.CommonReducer);
  const amazonAccountNames = async () => {
    try {
      const result = await _GET(AMAZON_ACCOUNTS);

      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = accounts.find(acc => acc.label === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.label])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.label])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.label])
      }
      setBrandOptionData(accounts);
      setSelectedAccountVal(accountsFilter[0].value);
      setBrandDataListing(accounts);
      // setBrandOptions(accounts);
      // if (responseAccount?.data?.data) {
      //   setSelectedAccountVal(responseAccount.data.data[0].value);
      //   setBrandOptionData(responseAccount.data.data);
      //   setBrandOptions(responseAccount.data.data)
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        label: item._id.account,
        value: item._id.account,
        account_id: item._id.account_id,
        platform_id: item._id.platform_id,
      }));
      let filters = defaultFilterCheck(accounts, commonReducer.platFormType);
      const brandOptionDatas = accounts.map((item) => ({
        label: item.value,
        value: item.value,
      }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = accounts.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }
      setSelectedAccountVal(accountsFilter[0].value);
      setBrandOptionData(brandOptionDatas);
      setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  const zeptoAccountNames = async () => {
    try {
      const result = await _GET(GET_ZEPTO_ACCOUNTS);
      const profile_data = result.data.data;
      const brandOptionDatas = profile_data.map((item) => ({
        label: item.account_name,
        value: item.account_name,
      }));
      let accountsFilter = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = brandOptionDatas.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }
      // let filters = defaultFilterCheck(
      //   brandOptionDatas,
      //   commonReducer.platFormType
      // );

      setBrandOptionData(brandOptionDatas);
      setSelectedPlatformVal(accountsFilter[0].value);
      setBrandDataListing(brandOptionDatas);
       setBrandOptions(brandOptionDatas);
    } catch (error) {
      console.error(error);
    }
  };

  const instamartAccountNames = async () => {
    try {
      const result = await _GET(INSTAMART_BRANDS);
      const profile_data = result.data.data;
      const brandOptionDatas = profile_data.map((item) => ({
        label: item.brand,
        value: item.brand,
      }));
      let accountsFilter = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = brandOptionDatas.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }

      setBrandOptionData(brandOptionDatas);
      setSelectedPlatformVal(accountsFilter[0].value);
      setBrandDataListing(brandOptionDatas);
       setBrandOptions(brandOptionDatas);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   instamartAccountNames();
  // }, []);
  useEffect(() => {
    if (commonReducer.platFormType === "/flipkart") {
      accountNames();
    } else if (commonReducer.platFormType === "/amazon") {
      amazonAccountNames();
    } else if (commonReducer.platFormType === "/zepto") {
      zeptoAccountNames();
    } else if (commonReducer.platFormType === "/instamart") {
      instamartAccountNames();
    }
  }, []);

  const platformsData = [
    {
      label: "Flipkart",
      value: "MP",
    },
    {
      label: "Supermart",
      value: "SM",
    },
  ];

  const typeData = [
    {
      label: "PLA",
      value: "PLA",
    },
    {
      label: "PCA",
      value: "PCA",
    },
  ];

  const zeptoData = [
    {
      label: "Awareness",
      value: "Awareness",
    },
    {
      label: "Performance",
      value: "Performance",
    },
  ];

  return (
    <>
      <div className="flipkart__card flex justify-between">
        {commonReducer.platFormType === "/flipkart" && (
          <>
            <div className="flipkart__selectfilter ">
              {/* {brandOptionData.length > 0 && (
                <SelectDropDrown
                  FilterHeading="Select Account"
                  selectAllDefault={true}
                  setDefault={selectedAccountVal}
                  // options={["Brand 1", "Brand 2", "Brand 3"]}
                  setSelectedVal={setSelectedAccountVal}
                  selectedVal={selectedAccountVal}
                  options={brandOptionData}
                  platform
                />
              )} */}
              {brandOptionData.length > 0 && (
                <CustomSelect
                  label={"Select"}
                  options={brandOptionData}
                  value={selectedAccountVal}
                  onChange={setSelectedAccountVal}
                  name="campaignManagerAms"
                  platform={commonReducer.platFormType}
                  localStorageAccounts
                />
              )}
            </div>
            <div className="flipkart__selectfilter">
              {" "}
              <SelectDropDrown
                FilterHeading="Select Platform"
                selectAllDefault={true}
                // options={["MP", "SM"]}
                setSelectedVal={setSelectedPlatformVal}
                selectedVal={selectedPlatformVal}
                options={platformsData}
                platform={platform}
              />
            </div>
            <div className="flipkart__selectfilter">
              {" "}
              <SelectDropDrown
                FilterHeading="Select Type"
                selectAllDefault={true}
                // options={["PLA", "PCA"]}
                setSelectedVal={setSelectedTypeVal}
                selectedVal={selectedTypeVal}
                options={typeData}
                platform={platform}
              />
            </div>
          </>
        )}
        {commonReducer.platFormType === "/amazon" && (
          <>
            <div className="flipkart__selectfilter">
              {brandOptionData.length > 0 && (
                <CustomSelect
                  label={"Select"}
                  options={brandOptionData}
                  value={selectedAccountVal}
                  onChange={setSelectedAccountVal}
                  name="campaignManagerAms"
                  platform={commonReducer.platFormType}
                  localStorageAccounts
                />
              )}
            </div>
            <div className="flipkart__selectfilter">
              {" "}
              {portfolioOptionData.length > 0 && (
                <SelectDropDrown
                  FilterHeading="Select Portfolio"
                  selectAllDefault={true}
                  // options={["MP", "SM"]}
                  setSelectedVal={setSelectedPlatformVal}
                  selectedVal={selectedPlatformVal}
                  options={portfolioOptionData}
                  platform={platform}
                />
              )}
            </div>
          </>
        )}

        {commonReducer.platFormType === "/blinkit" && (
          <div className="flipkart__selectfilter2 ">
            <SelectDropDrown
              FilterHeading="Select Account"
              selectAllDefault={true}
              setDefault={selectedAccountVal}
              // options={["Brand 1", "Brand 2", "Brand 3"]}
              setSelectedVal={setSelectedAccountVal}
              selectedVal={selectedAccountVal}
              options={brandOption}
              platform="blinkit"
            />
          </div>
        )}

        {commonReducer.platFormType === "/instamart" && (
          <>
            <div className="flipkart__selectfilter">
              {/* {brandOptionData.length > 0 && (
                <SelectDropDrown
                  FilterHeading="Select Account"
                  selectAllDefault={true}
                  setDefault={selectedPlatformVal}
                  setSelectedVal={setSelectedPlatformVal}
                  selectedVal={selectedPlatformVal}
                  options={brandOptionData}
                  platform="zepto"
                />
              )} */}

              {brandOptionData.length > 0 && (
                <CustomSelect
                  label={"Select"}
                  options={brandOptionData}
                  value={selectedPlatformVal}
                  onChange={setSelectedPlatformVal}
                  name="campaignManagerAms"
                  platform={commonReducer.platFormType}
                  localStorageAccounts
                />
              )}
            </div>
            {/* <div className="flipkart__selectfilter2">
              {" "}
              <SelectDropDrown
                FilterHeading="Select Type"
                selectAllDefault={true}
                // options={["PLA", "PCA"]}
                setSelectedVal={setSelectedTypeVal}
                selectedVal={selectedTypeVal}
                options={typeData}
              />
            </div> */}
            <div className="flipkart__selectfilter2">
              {/* <SelectDropDrown
              FilterHeading="Select Account"
              selectAllDefault={true}
              setDefault={selectedAccountVal}
              // options={["Brand 1", "Brand 2", "Brand 3"]}
              setSelectedVal={setSelectedAccountVal}
              selectedVal={selectedAccountVal}
              options={brandOption}
              platform="zepto"
            /> */}
            </div>
          </>
        )}

        {commonReducer.platFormType === "/zepto" && (
          <>
            <div className="flipkart__selectfilter">
              {/* {brandOptionData.length > 0 && (
                <SelectDropDrown
                  FilterHeading="Select Account"
                  selectAllDefault={true}
                  setDefault={selectedPlatformVal}
                  setSelectedVal={setSelectedPlatformVal}
                  selectedVal={selectedPlatformVal}
                  options={brandOptionData}
                  platform="zepto"
                />
              )} */}

              {brandOptionData.length > 0 && (
                <CustomSelect
                  label={"Select"}
                  options={brandOptionData}
                  value={selectedPlatformVal}
                  onChange={setSelectedPlatformVal}
                  name="campaignManagerAms"
                  platform={commonReducer.platFormType}
                  localStorageAccounts
                />
              )}
            </div>
            {/* <div className="flipkart__selectfilter2">
              {" "}
              <SelectDropDrown
                FilterHeading="Select Type"
                selectAllDefault={true}
                // options={["PLA", "PCA"]}
                setSelectedVal={setSelectedTypeVal}
                selectedVal={selectedTypeVal}
                options={typeData}
              />
            </div> */}
            <div className="flipkart__selectfilter2">
              <SelectDropDrown
                FilterHeading="Select Campaign Type"
                selectAllDefault={true}
                //setDefault={selectedAccountVal}
                // options={["Brand 1", "Brand 2", "Brand 3"]}
                setSelectedVal={setSelectedAccountVal}
                selectedVal={selectedAccountVal}
                options={zeptoData}
                platform="zepto"
              />
              {/* <SelectDropDrown
              FilterHeading="Select Account"
              selectAllDefault={true}
              setDefault={selectedAccountVal}
              // options={["Brand 1", "Brand 2", "Brand 3"]}
              setSelectedVal={setSelectedAccountVal}
              selectedVal={selectedAccountVal}
              options={brandOption}
              platform="zepto"
            /> */}
            </div>
          </>
        )}
        <div className=" flipkart__calander p-4">
          <DatePicker
            className="border"
            onChangeDate={onChangeDate}
            applyDate={applyDate}
            cancelDate={cancelDate}
            dashboard={dashboard}
            state={dateRange}
            setState={setDateRange}
            calState={calState}
            setCalState={setCalState}
            positionLeft="calLeft"
            platform={platform}
            // position={
            //   JSON.parse(localStorage.getItem("platform_type")) === "/blinkit"
            //     ? ""
            //     : ""
            // }
            source={
              JSON.parse(localStorage.getItem("platform_type")) === "/blinkit"
                ? "blinkit"
                : JSON.parse(localStorage.getItem("platform_type")) === "/zepto"
                ? "zepto"
                : "flipkart"
            }
          />
        </div>
        {applybtn && <Button className="bg-[#11B07A]" title={"apply"} />}
      </div>
    </>
  );
};
export default OptionsHeader;
