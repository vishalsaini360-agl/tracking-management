import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { setPlatformType } from "../../../redux/action-creator/commonAction";
import { AuthContext } from "../../../context/authContext";
import { useContext } from "react";
import Popup from "../Popups/Popup";
import Profile from "../profile/Profile";
import "../dialogBox.js/dialog.css";
import availableRoutes from "../../../routes/availableRoutes";
import { loggedOut } from "../../../redux/action-creator/authCreator";
import {
  ONECOMMERCE_LOGIN_URL,
} from "../../../utils/url";

// import egenie from "../../CommonSidebar/icons/egenie.svg";
// import { useClientPermission } from "../../../context/ClientPermissionContext";
import HeaderDatePicker from "./HeaderDatePicker";
import { BsSliders2 } from "react-icons/bs";
import Drawer from "@mui/material/Drawer";
import DrawerEdit from "./Drawer/DrawerEdit"
import { useEbuxContext } from "../../Ebux/Context/EbuxProvider";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

import { APPLICATION_ROUTES } from "../../../utils/constants";
import { getCombineFilterWidget } from "../../Ebux/services/ebux.service";
import HeaderWeekPicker from "./HeaderDatePicker/HeaderWeekPicker";
import axiosInstance from "../../../services/axios.service";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../tracker";


// export default ToastPortal;

const Header = () => {
  const {
    ebuxLoading,
    kpi, selectedFilters,
    headerFilterChips, filtersDarkStore,
    // setHeaderFilterChips,
    selectedHeaderOpen, setSelectedHeaderOpen, filtersLoading,

    selectedMsl, activeClientProject, updateSelectedMSLV2,

    selectedFiltersWidget,
    setSelectedFilters,
    setFilters,
    setSelectedMsl,
    setSelectedFiltersWidget,
    setFiltersDarkStore,
    setEbuxLoading,
    tempFilterData,
    setTempFilterData,
    errorToSetFilterData,
    setErrorToSetFilterData,
    setSelectedMslFilter,
    setHeaderFilterChips,
    firstTimeLoadFilter, setFirstTimeLoadFilter
  } = useEbuxContext();

  // const { clientPermission } = useClientPermission();
  // console.log('clientPermission', clientPermission)
  // console.log('filtersLoadingfiltersLoading', filtersLoading)
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  let name;
  let header = availableRoutes?.filter(
    (item) => {
      if (item?.routePath == '/configuration/:page' || item?.routePath == '/pricing-rule-engine/:page' || item?.routePath == '/alert-control/:page') {
        return item?.routePath?.split('/')?.[1] == location?.pathname?.split('/')?.[1]
      } else {
        return item.routePath === location.pathname
      }
    }
  );
  // console.log('headerheader',availableRoutes,location?.pathname)
  // console.log('headerheader22',availableRoutes,location?.pathname?.split('/')?.[1],('/configuration/:page')?.split('/')?.[1])
  const user_info = useSelector((state) => state?.AuthReducer);
  const dispatch = useDispatch();

  const headerDropdown = useRef(null);
  const notificationRef = useRef(null);
  const [, setHeaderPlatform] = useState("");
  const [, setPlatforms] = useState([]);

  const [popup, setPopup] = useState(false);
  const [, setdialog] = useState(false);
  const [showOpenModal, setOpenModal] = useState(false);
  const authContext = useContext(AuthContext);
  const { onLogout } = authContext;

  const logout = async () => {
    try {
      setPopup(false);

      const email = localStorage.getItem("email");
      const access_token = localStorage.getItem("access_token");

      if (email && access_token) {
        await axiosInstance.post(
          `${process.env.REACT_APP_IDENTITY_MODULE_BASE_URL}user/logout`,
          {
            email,
            access_token,
          }
        );
        console.log('logout success')
      }

      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("clientPermission");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("full_name");
      sessionStorage.removeItem("client_id");
      sessionStorage.removeItem("client_name");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("client_projects");
      sessionStorage.removeItem("im_token");
      sessionStorage.removeItem("email");
      localStorage.clear();

      window.location.href = ONECOMMERCE_LOGIN_URL;

    } catch (error) {
      console.log('error', error)
      window.location.href = ONECOMMERCE_LOGIN_URL;
      dispatch(loggedOut("Logged Out"));
      onLogout();
    }
  };



  const getNotificationCount = async () => {
    // let data = {};
    // if (localStorage.getItem("notification-platform")) {
    //   data = {
    //     platform: localStorage.getItem("notification-platform"),
    //     status: "0",
    //   };
    // } else {

    //   data = {
    //     platform: localStorage.getItem("platform_type"),
    //     status: "0",
    //   };
    // }
  };

  React.useEffect(() => {
    name = localStorage.getItem("name");
    const sortedPlatforms = _.sortBy(user_info?.platforms, 'platform_id');
    const platformValues = _.map(sortedPlatforms, 'platform_value');
    // console.log("cheking platform value", platformValues);

    setPlatforms(platformValues);
    dispatch(setPlatformType(header[0].sidebar));
    setHeaderPlatform(header[0].sidebar);
    localStorage.setItem("platform_type", JSON.stringify(header[0].sidebar));
    getNotificationCount();
    localStorage.removeItem("notification-platform");

    localStorage.removeItem("notification-platform");
    const intervalId = setInterval(getNotificationCount, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      headerDropdown.current &&
      !headerDropdown.current.contains(event.target)
    ) {
      setPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutsideNotif = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      localStorage.removeItem("notification-platform");
      getNotificationCount();
      setdialog(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideNotif);
    return () => {
      document.removeEventListener("click", handleClickOutsideNotif);
    };
  }, []);


  const client_projects = JSON.parse(localStorage.getItem("client_projects") ?? "[]");

  const [active_client_project, setActiveClientProject] = useState({});
  const previous_active_client_project = useRef();
  useEffect(() => {
    const active_client = JSON.parse(localStorage.getItem("active_client_project") ?? "{}");
    previous_active_client_project.current = JSON.stringify(active_client);
    setActiveClientProject(active_client);
  }, []);
  const handle_active_client_project_change = (new_active_client_project) => {
    if (previous_active_client_project.current != JSON.stringify(new_active_client_project)) {
      previous_active_client_project.current = JSON.stringify(new_active_client_project);
      localStorage.setItem("active_client_project", JSON.stringify(new_active_client_project));
      localStorage.setItem("client_id", new_active_client_project?.one_commerce_client_id ?? "");
      setActiveClientProject(new_active_client_project);
      if (new_active_client_project?.globalView) {
        window.location.href = APPLICATION_ROUTES.COMMONSCREEN;
      } else {
        window.location.reload();
      }
    }
    setPopup(false);
  }

  // const [selected, setSelected] = useState({});

  const toggleDrawer = (type, newOpen) => () => {
    setSelectedHeaderOpen({ [type]: newOpen });
  };
  const accounts = useMemo(() => {
    if (active_client_project?.globalView) {
      return [...new Set((client_projects ?? [])?.map(i => i?.account))];
    } else {
      return [];
    }

  }, [client_projects, active_client_project]);
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(active_client_project?.account);
  const [selectedCountry, setSelectedCountry] = useState(active_client_project?.country);
  useEffect(() => {
    setSelectedAccount(active_client_project?.account);
    setSelectedCountry(active_client_project?.country);

  }, [active_client_project])


  const handleChange = async (event) => {
    if ([110, 114].includes(Number(activeClientProject?.client_project_id))) {
      return;
    }
    const value = event.target.value;
    trackCustomEvent(
      EVENTS.RADIO,
      { item: value === "msl" ? "MSL" : "All", section: "product_filter", msl_type: value },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON })
    );
    if (!firstTimeLoadFilter) {
      setFirstTimeLoadFilter(true)
    }
    //  console.log('valuevalue',value)
    if ([2].indexOf(activeClientProject?.client_project_id) > -1) {
      let combineFilterWidget;
      if (activeClientProject?.isFilterDateWise) {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, [], dateRangeData);
      } else {
        combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value);
      }

      setFilters(prevFilters => ({
        ...prevFilters,
        platform: combineFilterWidget?.platforms ?? [],
        brand: combineFilterWidget?.brands ?? [],
        category: combineFilterWidget?.categories ?? [],
        mother_pack: combineFilterWidget?.mother_packs ?? [],
        products: combineFilterWidget?.products ?? [],
        ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
      }));

      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        // selectedProductId: (combineFilterWidget?.products ?? []),
        // selectedPlatform: (combineFilterWidget?.platforms ?? []),
        selectedMsl: value
      }));
      setSelectedMslFilter(value);
      setSelectedMsl(value);
      if (value == 'msl') {
        setHeaderFilterChips((prev) => {
          return {
            ...prev,
            msl: [{
              label: "MSL",
              value: 1,
            }],
          }
        });
      } else {
        setHeaderFilterChips((prev) => {
          return {
            ...prev,
            msl: [],
          }
        });
      }

    } else {
      updateSelectedMSLV2(value);
    }
  };
  return (
    <>
      <div className="header px-2 pl-6" id="header-custom">

        {/* <img src={egenie} width={30} height={30} />
        <div className="text-[22px] leading-[22px] text-[#333333]"> e-Genie Suite</div> */}
        <div className="font-semibold text-lg leading-[22px] text-[#333333]"> Digital Shelf Management</div>
        <div className="col ">
          <div className=" header__rightMenu relative">

            {((header?.[0]?.showHeaderCalender == false || location?.pathname == "/configuration/buy-box-seller-settings") ? <></> :
              (filtersDarkStore?.tab_type == "trend_analysis" || (activeClientProject?.calendarType == "week")
                ?
                <HeaderWeekPicker compareModeOn={filtersDarkStore?.tab_type != "trend_analysis"} isFilterDateWise={activeClientProject?.isFilterDateWise} />
                :
                <HeaderDatePicker isFilterDateWise={activeClientProject?.isFilterDateWise} />
              ))}
            {
              (!location?.pathname?.toLowerCase()?.includes('/alert-control') && ([2].indexOf(activeClientProject?.client_project_id) > -1) && active_client_project?.isUseWidget && (["SOS", "OR", "SOM", "Wt_SOS"]?.indexOf(kpi) == -1)) ?
                <div className="flex items-center gap-2 pl-[0px] rounded-full ">
                  <span className="text-sm font-semibold text-gray-800">Product Filter:</span>
                  <RadioGroup
                    row
                    value={selectedMsl}   // 🔹 bind global state
                    onChange={handleChange}
                    className="flex items-center text-xs pl-2"
                  >
                    <FormControlLabel
                      value="all"
                      control={
                        <Radio
                          color="primary"
                          disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                          sx={{
                            transform: "scale(1)", // smaller radio
                            padding: "0px",
                          }}
                        />
                      }
                      disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                      label="All"
                      slotProps={{
                        typography: {
                          className: `!text-[12px] ${selectedMsl === "all" ? "font-bold text-blue-600" : ""}`,
                        },
                      }}
                    />
                    <FormControlLabel
                      value="msl"
                      control={
                        <Radio
                          color="primary"
                          disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                          sx={{
                            transform: "scale(1)",
                            padding: "0px",
                          }}
                        />
                      }
                      disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                      label="MSL"
                      slotProps={{
                        typography: {
                          className: `!text-[12px] ${selectedMsl === "msl" ? "font-bold text-blue-600 " : ""}`,
                        },
                      }}
                    />
                  </RadioGroup>
                </div>
                :
                <></>
            }

            {
              (!location?.pathname?.toLowerCase()?.includes('/alert-control') && active_client_project?.isUseWidget) ?
                ((header?.[0]?.headerFilter == false || location?.pathname == "/configuration/buy-box-seller-settings") ? <></> :
                  <button disabled={filtersLoading} className={`flex flex-row gap-1 border-[1px] border-[#D9D9D9] px-3 py-2.5 rounded-md items-center text-[#000000D9] ${filtersLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} onClick={() => {
                    trackCustomEvent(EVENTS.BUTTON_CLICK, { item: "Filter", action: "open_filter_drawer" }, ENTITY_TYPE.FILTER, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON }));
                    toggleDrawer("edit", true)();
                  }}><BsSliders2 />Filter</button>
                ) : <></>
            }
            {
              (active_client_project?.globalView) ?

                <div className=" flex z-100">
                  <div ref={headerDropdown} className="relative">
                    <div className="header__rightMenu--admin ">
                      <div className="row items-start">
                        <button
                          className="header__rightMenu--image"
                          onClick={() => {
                            trackCustomEvent(!popup ? EVENTS.POPUP_OPEN : EVENTS.POPUP_CLOSE, { client_name: active_client_project?.client_project_name ?? active_client_project?.account }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.DROPDOWN }));
                            setPopup(!popup);
                          }}
                        >
                          <div className="flex gap-1 items-center">

                            {active_client_project?.logo_url ?
                              <img
                                className="rounded-full w-[30px] h-[30px]"
                                src={active_client_project?.logo_url}
                                alt={active_client_project?.client_project_name}
                              />
                              : <></>}
                            <h2 className="capitalize text-[18px] font-semibold">{active_client_project?.account ?? active_client_project?.client_project_name ?? ""}</h2>



                          </div>
                          {active_client_project?.flag ?
                            <div className="flex items-center space-x-3 border-l border-gray-300 pl-3">
                              <img
                                src={active_client_project?.flag}
                                alt={active_client_project?.country ?? active_client_project?.client_project_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </div>
                            : <></>
                          }
                        </button>
                      </div>
                    </div>
                    {popup && (
                      <div className="user_options" style={{ width: "400px" }}>
                        <div
                        // className="fixed inset-0 flex items-center justify-end bg-black/30 z-50"
                        >
                          <div className="bg-white rounded-lg shadow-xl w-[400px] max-h-[80vh] overflow-y-auto">
                            {/* Header */}
                            {/* <div className="flex justify-between items-center px-5 py-3 border-b">
                              <h2 className="text-lg font-semibold">Account Selection</h2>
                              <button onClick={() => setPopup(!popup)} className="text-gray-500 hover:text-gray-700">
                                ✕
                              </button>
                            </div> */}

                            {/* Accounts dropdown */}
                            <div className="py-2 px-3 border-b">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Accounts
                              </label>
                              <select value={selectedAccount} onChange={(e) => {
                                trackCustomEvent(EVENTS.DROPDOWN_SELECT, { item: e?.target?.value, field: "account" }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.DROPDOWN }));
                                setSelectedAccount(e?.target?.value ?? null);
                              }} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                {accounts?.map((i, idx) =>
                                  <option value={i} key={i + idx} >{i}</option>
                                )}
                              </select>
                            </div>

                            {/* Countries */}
                            <div className="py-2 px-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Countries
                              </label>
                              <input
                                type="text"
                                placeholder="Search Country"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={(e) => {
                                  if (e.target.value) {
                                    trackCustomEvent(EVENTS.SEARCH, { search_country: e.target.value }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type));
                                  }
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />

                              {/* Country list */}
                              <div className="space-y-1 max-h-[110px] overflow-y-auto">
                                {client_projects && client_projects?.length ? client_projects?.filter(i => i?.account == selectedAccount)?.map((project, idx) => (
                                  (!search || !search?.length) || (search?.length && project?.country?.toLowerCase().includes(search.toLowerCase()))
                                    ?
                                    <label
                                      key={project?.country + idx}
                                      className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedCountry == project?.country}
                                        onChange={() => {
                                          trackCustomEvent(EVENTS.CHECKBOX, { country: project?.country }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.CHECKBOX }));
                                          setSelectedCountry(project?.country);
                                        }}
                                        className="h-4 w-4"
                                      />
                                      {project?.flag ?
                                        <img
                                          className="rounded-full w-6 h-6"
                                          src={project?.flag}
                                          alt={project?.country ?? project?.client_project_name}
                                        />
                                        : <></>}
                                      <span className="text-sm font-medium text-gray-700">{project.country}</span>
                                    </label>
                                    : <></>

                                ))
                                  : <></>
                                }
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex  gap-3 px-5 py-3 border-t justify-between">
                              <div className="flex items-center gap-3 justify-start">

                                <button className="flex flex-row gap-1 bg-[#E0F0FF]  px-2.5 py-2 rounded-lg items-center hover:bg-gray-200" onClick={() => {
                                  setOpenModal(!showOpenModal);
                                }}>
                                  <img src="/assets/images/userImg.jpg" className="w-6 h-6 rounded-full border border-[#0081F7]" alt="" />

                                </button>
                                <button className="flex flex-row gap-1 bg-[#E0F0FF] rounded-lg  px-2.5 py-2  items-center hover:bg-gray-200" onClick={() => logout()}>
                                  <img src="/assets/images/logout.svg" className="w-4 h-4" alt="" />
                                  Sign out
                                </button>
                              </div>
                              <div className="flex items-center justify-end gap-3 ">
                                <button
                                  onClick={() => {
                                    trackCustomEvent(EVENTS.BUTTON_CLICK, { action: "cancel_client_change" }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON }));
                                    setPopup(!popup);
                                  }}
                                  className="px-4 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    const project = client_projects?.filter(i => i?.account == selectedAccount && i?.country == selectedCountry);
                                    trackCustomEvent(EVENTS.BUTTON_CLICK, {
                                      action: "apply_client_change",
                                      client_name: project?.[0]?.client_project_name,
                                      client_project_id: project?.[0]?.client_project_id,
                                      account: selectedAccount,
                                      country: selectedCountry
                                    }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON }));
                                    project?.length && handle_active_client_project_change(project?.[0]);
                                  }}
                                  className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {showOpenModal && (
                          <Popup
                            title="Welcome"
                            setShowPopup={setOpenModal}
                            smallsize
                            cutomButton={[
                              {
                                handleClick: () => setOpenModal(!showOpenModal),
                                label: "OK",
                                style: "",
                              },
                            ]}
                          >
                            <Profile />
                          </Popup>
                        )}

                        {/* <select>
                        {accounts?.map((i,idx)=>
                          <option value={i} key={i+idx} >{i}</option>
                        )}
                      </select>
                      
                      <ul className="" style={{ width: "400px" }}>
                        

                        {client_projects && client_projects?.length ? client_projects?.map(
                          (project, project_index) => (

                            <li key={project_index} className="user_options_content" onClick={() => { handle_active_client_project_change(project) }}>
                              <div className="user_list_content gap-2">
                                {project?.flag ?
                                  <img
                                    className="rounded-full w-6 h-6"
                                    src={project?.flag}
                                    alt={project?.country??project?.client_project_name}
                                  />
                                  : <></>}
                                <h2 className="capitalize text-[18px]">{project?.country??project?.client_project_name}</h2>

                              </div>
                            </li>
                          )
                        ) : <></>}




                        

                        <hr className="mt-2.5" />
                        <li className="signout_content flex items-center justify-between">
                          <div className="flex items-center gap-2 justify-start">

                            <button className="flex flex-row gap-1 bg-[#E0F0FF]  px-2.5 py-2 rounded-lg items-center hover:bg-gray-300" onClick={() => {
                              setOpenModal(!showOpenModal);
                            }}>
                              <img src="/assets/images/userImg.jpg" className="w-6 h-6 rounded-full border border-[#0081F7]" alt="" />
                              
                            </button>
                            <button className="flex flex-row gap-1 bg-[#E0F0FF] rounded-lg  px-2.5 py-2  items-center hover:bg-gray-300" onClick={() => logout()}>
                              <img src="/assets/images/logout.svg" className="w-4 h-4" alt="" />
                              Sign out
                            </button>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={()=>{}}
                              className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => { }}
                              className="px-4 py-1.5 bg-[#1890FF] text-white rounded-lg hover:bg-blue-700"
                            >
                              Apply
                            </button>
                          </div>

                        </li>
                      </ul> */}
                      </div>
                    )}
                  </div>
                </div>
                :
                <div className=" flex  z-100">
                  <div ref={headerDropdown} className="relative">
                    <div className="header__rightMenu--admin ">
                      <div className="row items-start">
                        <button
                          className="header__rightMenu--image"
                          onClick={() => {
                            trackCustomEvent(!popup ? EVENTS.POPUP_OPEN : EVENTS.POPUP_CLOSE, { client_name: active_client_project?.client_project_name }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.DROPDOWN }));
                            setPopup(!popup);
                          }}
                        >
                          <div className="flex gap-1 items-center">

                            {active_client_project?.logo_url ?
                              <img
                                className="rounded-full w-[30px] h-[30px]"
                                src={active_client_project?.logo_url}
                                alt={active_client_project?.client_project_name}
                              />
                              : <></>}
                            <h2 className="capitalize text-[18px] font-semibold">{active_client_project?.client_project_name ?? ""}</h2>



                          </div>
                          <img src="/assets/images/dropdownArrow.svg" className="w-4 h-4" alt="" />
                        </button>
                      </div>
                    </div>
                    {popup && (
                      <ul className="user_options">
                        <li
                          className="user_options_content"
                        >
                          <button className="flex flex-row gap-1 bg-[#E0F0FF] w-full p-2.5 rounded items-center" onClick={() => {
                            setOpenModal(!showOpenModal);
                          }}>
                            <img src="/assets/images/userImg.jpg" className="w-8 h-8 rounded-full border border-[#0081F7]" alt="" />
                            <h2 className="capitalize">
                              {localStorage.getItem("name")
                                ? localStorage.getItem("name")
                                : null}</h2>
                          </button>
                        </li>

                        {client_projects && client_projects?.length ? client_projects?.map(
                          (project, project_index) => (

                            <li key={project_index} className="user_options_content" onClick={() => {
                              trackCustomEvent(EVENTS.DROPDOWN_SELECT, {
                                client_name: project?.client_project_name,
                                client_project_id: project?.client_project_id,
                                country: project?.country,
                                account: project?.account
                              }, ENTITY_TYPE.CLIENT_DROPDOWN, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.DROPDOWN }));
                              handle_active_client_project_change(project);
                            }}>
                              <div className="user_list_content">
                                {project?.logo_url ?
                                  <img
                                    className="rounded-full w-[30px] h-[30px]"
                                    src={project?.logo_url}
                                    alt={project?.client_project_name}
                                  />
                                  : <></>}
                                <h2 className="capitalize text-[18px]">{project?.client_project_name}</h2>

                              </div>
                            </li>
                          )
                        ) : <></>}




                        {showOpenModal && (
                          <Popup
                            title="Welcome"
                            setShowPopup={setOpenModal}
                            smallsize
                            cutomButton={[
                              {
                                handleClick: () => setOpenModal(!showOpenModal),
                                label: "OK",
                                style: "",
                              },
                            ]}
                          >
                            <Profile />
                          </Popup>
                        )}

                        <hr className="mt-2.5" />
                        <li className="signout_content" onClick={logout}>
                          <img src="/assets/images/logout.svg" className="w-4 h-4" alt="" />
                          Sign out
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
            }

          </div>
        </div>
        <Drawer
          open={selectedHeaderOpen?.edit}
          onClose={toggleDrawer("edit", false)}
          anchor={"right"}
          className="!z-[99999]"
        >
          <DrawerEdit onClose={toggleDrawer("edit", false)} defaultSelected={headerFilterChips} />
        </Drawer>

      </div>
      {
        ebuxLoading ? (<div className="w-full h-screen grid justify-items-stretch align-middle bg-black/50 overflow-hidden bg-opacity-50 absolute top-0 right-0 bottom-0 left-0 z-[999999999999]">
          <img
            className="w-1/6 justify-self-center inline-block align-middle mt-48 "
            src="/assets/images/egenie.gif"
            alt="loader"
          />
        </div>) : null
      }
      {
        errorToSetFilterData ? (
          <div className="w-full h-screen grid justify-items-stretch align-middle bg-black/50 overflow-hidden bg-opacity-50 absolute top-0 right-0 bottom-0 left-0 z-[999999999999] items-center">
            <div className="justify-self-center bg-white p-4 rounded-lg max-w-md max-h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-2">
              <div className="flex-1">
                {tempFilterData?.errorData?.noDataFound ? <div className="flex items-center gap-2 flex-col">
                  <strong className="text-red-600 flex items-center">
                    <img
                      className="w-5 mr-1"
                      src="/assets/images/warning.png"
                      alt="warning"
                    />

                    Warning</strong>No data is available for the selected filters and date range. Click Confirm to reset back to the previous state and re-apply different filters.</div> :
                  <div className="flex items-center gap-2 flex-col">
                    <strong className="text-red-600 flex items-center">
                      <img
                        className="w-5 mr-1"
                        src="/assets/images/warning.png"
                        alt="warning"
                      />

                      Warning</strong>Inapplicable Filters
                    The following selected filters are not applicable for your chosen date range:
                    <ul className="gap-2 p-2">
                      {Object.keys(tempFilterData?.errorData)?.map((filterKey, index) => (
                        <li key={index}>
                          <strong>{filterKey}</strong>: {tempFilterData?.errorData[filterKey]}
                        </li>
                      ))}
                    </ul>

                    Data may appear empty or inaccurate because these filters are unavailable for this period.
                    Click Confirm to continue with these filters or click Cancel to revert.
                  </div>
                }

              </div>
              <div className="flex justify-end gap-2">
                {tempFilterData?.errorData?.noDataFound ? <button
                  onClick={() => {
                    setErrorToSetFilterData(false);
                  }}
                  className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                >
                  Confirm
                </button>
                  :
                  <>
                    <button
                      onClick={() => {
                        setErrorToSetFilterData(false);
                      }}
                      className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // setTempFilterData({});
                        setFilters((prevFilters) => {
                          const updatedFilters = {
                            ...prevFilters,
                            platform: tempFilterData?.apiResponse?.res_platform_pdp,
                            brand: tempFilterData?.apiResponse?.res_brand_pdp,
                            category: tempFilterData?.apiResponse.res_category ?? [],
                            location: (["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) ? tempFilterData?.apiResponse?.res_location_new_kw ?? [] : tempFilterData?.apiResponse?.res_location_new_pdp ?? [],
                            locationPincode: (["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) ? tempFilterData?.apiResponse?.location_kw ?? [] : tempFilterData?.apiResponse?.location_pdp ?? [],
                            darkstore: tempFilterData?.apiResponse?.res_darkstore_pdp ?? [],
                            darkstore_id: tempFilterData?.apiResponse?.darkstore_pdp,
                            products: tempFilterData?.apiResponse.res_products ?? [],
                            mother_pack: tempFilterData?.apiResponse.res_mother_pack ?? [],
                            ...((tempFilterData?.apiResponse?.range) ? { range: tempFilterData?.apiResponse?.range ?? [] } : {}),

                            keywordCategory: tempFilterData?.apiResponse?.keywordCategory ?? [],
                            keyword: tempFilterData?.apiResponse?.keyword ?? [],

                            category_som: tempFilterData?.apiResponse?.category_som ?? [],
                            category_node: tempFilterData?.apiResponse?.category_node ?? [],
                            ...(kpi == "BUYBOX") ? {
                              selectedSellerList: tempFilterData?.apiResponse?.res_buy_box_sellers ?? [],
                              selectedSellerType: tempFilterData?.apiResponse?.res_buy_box_seller_types ?? [],
                            } : {}
                          };

                          setSelectedFiltersWidget(prevSelectedFilters => ({
                            ...prevSelectedFilters,
                            ...((["SOS", "OR", "Wt_SOS"].indexOf(kpi) == -1) ?
                              { selectedPlatformPdp: tempFilterData?.apiResponse?.res_platform_pdp ?? [] } :
                              { selectedPlatformKW: tempFilterData?.apiResponse?.res_platform_pdp ?? [] })
                          }));

                          return updatedFilters;
                        });
                        if (activeClientProject?.isUseWidgetDarkstore && ["SOS", "OR", "SOM", "Wt_SOS", "BUYBOX", "GLOBALVIEW"].indexOf(kpi) == -1) {
                          setFiltersDarkStore(prevFilters => ({
                            ...prevFilters,
                            platform: tempFilterData?.apiResponse?.darkstore?.pf_id ?? [],
                            platform_reset: tempFilterData?.apiResponse?.darkstore?.pf_id ?? [],
                            brand: tempFilterData?.apiResponse?.darkstore?.brand ?? [],
                            brand_reset: tempFilterData?.apiResponse?.darkstore?.brand ?? [],
                            category: tempFilterData?.apiResponse?.darkstore?.category ?? [],
                            category_reset: tempFilterData?.apiResponse?.darkstore?.category ?? [],
                            products: tempFilterData?.apiResponse?.darkstore?.web_pid ?? [],
                            products_reset: tempFilterData?.apiResponse?.darkstore?.web_pid ?? [],
                            mother_pack: tempFilterData?.apiResponse?.darkstore?.mother_pack ?? [],
                            mother_pack_reset: tempFilterData?.apiResponse?.darkstore?.mother_pack ?? [],
                            location: tempFilterData?.apiResponse?.darkstore?.res_location_new ?? [],
                            location_reset: tempFilterData?.apiResponse?.darkstore?.res_location_new ?? [],
                            locationPincode: tempFilterData?.apiResponse?.darkstore?.location ?? [],
                            locationPincode_reset: tempFilterData?.apiResponse?.darkstore?.location ?? [],
                            darkstore: tempFilterData?.apiResponse?.darkstore?.darkStoreId ?? [],
                            darkstore_reset: tempFilterData?.apiResponse?.darkstore?.darkStoreId ?? [],
                            ...((tempFilterData?.apiResponse?.darkstore?.range) ? { range: tempFilterData?.apiResponse?.darkstore?.range } : {})
                          }))
                        }

                        setSelectedFilters(prevSelectedFilters => ({
                          ...prevSelectedFilters,
                          ...tempFilterData?.setSelectedFiltersData,
                          selectedMsl: selectedMsl
                        }));
                        setSelectedMslFilter(selectedMsl)
                        setEbuxLoading(false);
                        setTempFilterData({});
                        setErrorToSetFilterData(false);
                      }}
                      className="px-4 py-1.5 bg-[#1890FF] text-white rounded-lg hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  </>
                }
              </div>
            </div>

          </div>
        ) : null
      }
    </>
  );
};
export default Header;
