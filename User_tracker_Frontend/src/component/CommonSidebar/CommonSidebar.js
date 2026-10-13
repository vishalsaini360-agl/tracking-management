import { useEffect, useState } from "react";
import { navList, productList } from "./constant.js";
import lockIcon from "./icons/lock.svg";
import egenie from "./icons/egenie.svg";
import "./style.css";
import {
  ONECOMMERCE_URL as ONECOMMERCE_BASE_URL,
  IDENTITY_MODULE_BASE_URL,
  PROJECT_CONFIGURATION_BASE_URL
} from "../../utils/url.js";

import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import availableRoutes from "../../routes/availableRoutes.js";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
// import { platformBorder, 
//   platformTextObj
//  } from "../../style/StyleConstants.js";
// import { pushToDataLayerWithEvent } from "../../utils/helpers.js";
import { getLocalSidebarMenu, setLocalSidebarMenu } from "./helpers.js";
import { safeJsonParse } from "../../utils/helpers.js";
// import CommonHeader from "./CommonHeader.js";
import { useSelector } from "react-redux";
import { useEbuxContext } from "../Ebux/Context/EbuxProvider.js";
import { clearRedisCache } from "../Ebux/services/ebux.service";
import toast from "react-hot-toast";


const NewCommonSidebar = ({ children }) => {
  const { selectedHeaderOpen, setSelectedHeaderOpen } = useEbuxContext();
  const [activeLink, setActiveLink] = useState(1);
  const [list, setList] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const id_token = localStorage.getItem("id_token");
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const client_id = localStorage.getItem("client_id");


  const handleAlertClick = async (e) => {
    e.preventDefault();
    try {
      await clearRedisCache();
      toast.success("Cache cleared successfully!");
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Failed to clear cache.");
    }
  };

  const handleList = (projects) => {
    let newList = navList.map((el) => {
      let pro = projects.find((e) => e.id == el.id);
      const lock = pro?.permission === undefined ? false : !pro?.permission;
      return {
        ...el,
        appId: pro?.id || el?.id,
        projectDescription: pro?.projectDescription,
        url: !lock && pro?.url ? pro?.url : ONECOMMERCE_BASE_URL,
        lock,
      };
    });

    // To move Media Automation Management on top
    newList.sort((a, b) => (a.id === 1 ? -1 : b.id === 1 ? 1 : 0));
    // console.log('newListnewList',newList)
    setList(newList);
  };

  useEffect(() => {
    (async () => {
      try {
        const url =
          IDENTITY_MODULE_BASE_URL +
          `application/getApplicationsNew?clientId=${client_id}`;

        let res = await axios.get(url, {
          headers: {
            Authorization: access_token,
            idtoken: id_token,
          },
        });

        let projects = res?.data?.data?.app;
        if (!projects || projects.length === 0) {
          // In case of no projects, use productList as fallback
          projects = productList; // Unlock your project in product list and make others disable
        }
        handleList(projects);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        handleList(productList);
      }
    })();
  }, []);

  const toggleShowAllProducts = () => {
    setShowAllProducts((prev) => !prev);
  };
  return (
    <div className="flex bg-[#545658] max-h-screen relative justify-end">
      <div
        className="sidebar w-[94px] hover:w-[300px] min-h-screen bg-[#242627] overflow-hidden overflow-y-auto py-1 transition-all duration-300 absolute left-0 top-0 z-[99999999] flex flex-col"
        onClick={() => {
          if (selectedHeaderOpen?.edit) {
            setSelectedHeaderOpen((prev) => ({ ...prev, edit: false }));
          }
        }}
      >
        <div className="sidebar-logo h-[81px] pt-1 px-[8px]">
          <a href={`${ONECOMMERCE_BASE_URL}`}>
            <div className="border-b border-[#39393A] pb-3 flex items-center cursor-pointer">
              <div className="min-w-[58px] pl-3.5 pr-2 flex justify-center flex-[0_0_auto]">
                <img src={egenie} alt="" className="w-[50px] h-[56px]" />
              </div>
              <div className="w-[179px] h-[42px] flex-[0_0_auto]">
                <div className="sidebar-item hidden">
                  <p className="text-[16px] leading-[22px] font-medium text-[#FFFFFF]">
                    e-Genie{" "}
                  </p>
                  <p className="text-[16px] leading-[22px] font-medium text-[#FFFFFF]">
                    OneCommerce Suite
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
        {/* It should be list.length>0 */}
        {list.length > 0 && (
          <div className="sidebar-nav  overflow-y-auto overflow-x-hidden pl-[10px] pr-[10px] pt-2">
            <div className="bg-[#2E3133] rounded-[10px] px-2 py-3 space-y-2 cursor-pointer text-[#BFBFBF] overflow-x-hidden overflow-y-auto max-h-[calc(100vh-100px)] scrollbar">
              {list?.map((obj) => {
                return (
                  <ProductLink
                    key={obj?.id}
                    obj={obj}
                    showAllProducts={showAllProducts}
                    activeLink={activeLink}
                    setActiveLink={setActiveLink}
                    id_token={id_token}
                    access_token={access_token}
                    refresh_token={refresh_token}
                    client_id={client_id}
                    toggleShowAllProducts={toggleShowAllProducts}
                  />
                );
              })}
              {!showAllProducts && <NestedSidebar />}
            </div>
          </div>
        )}


        {localStorage.getItem("email") === "admin.user@adglobal360.com" && (
          <div className="sidebar-nav overflow-y-auto overflow-x-hidden pl-[10px] pr-[10px] pt-2 mt-auto pb-0">
            {/* <div className="bg-[#2E3133] rounded-[10px] px-2 py-3 space-y-2 cursor-pointer text-[#BFBFBF] overflow-x-hidden overflow-y-auto max-h-[calc(100vh-100px)] scrollbar"> */}
            <a onClick={handleAlertClick} className="min-h-[52px] rounded-[10px] group overflow-hidden transition-all duration-300 text-flipkartPrimary cursor-pointer">
              <div className="flex items-center w-full rounded-[10px] relative min-h-[52px]">
                <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto]"><i className="fas fa-database"></i></span>
                <div className="text-[16px] leading-[22px] font-normal w-[164px] flex-[0_0_auto] relative">
                  <div className="sidebar-item hidden truncate ">Clear Cache</div>
                </div>
              </div>
            </a>
            {/* </div> */}
          </div>
        )}
      </div>
      <div className="w-[calc(100%-94px)] h-screen bg-[#F0F2F5] overflow-hidden">
        {/* <CommonHeader {...rest} /> */}
        <div
          className={`py-0 px-0 ${location.pathname === "/blinkit/campaign" ? "bg-white" : ""
            }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default NewCommonSidebar;

const ProductLink = ({
  obj,
  showAllProducts,
  activeLink,
  id_token,
  access_token,
  refresh_token,
  client_id,
  toggleShowAllProducts,
}) => {
  // console.log('objdata',obj)
  const isPrimaryToggle = obj.id === 1;
  if (!showAllProducts && !isPrimaryToggle) return null;

  const Wrapper = isPrimaryToggle ? Link : "a";

  const href = isPrimaryToggle
    ? "#"
    : !obj.lock && ![1].includes(obj.id)
      ? `${obj.url}?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}`
      : ONECOMMERCE_BASE_URL + obj.lockUrl;

  return (
    <div>
      {
        <Wrapper
          {...(isPrimaryToggle
            ? { to: href, onClick: toggleShowAllProducts }
            : { href, rel: "noopener noreferrer" })}
        >
          <div
            className={`h-[52px] rounded-[10px] group hover:bg-[#39393A] overflow-hidden transition-[all] duration-300 text-[#BFBFBF] 
              ${activeLink === obj?.id ? " menuActive universal-active" : ""}`}
          >
            <div className="flex items-center w-full rounded-[10px] relative">
              <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto] relative">
                {obj?.icon()}
                {obj?.lock && (
                  <img
                    src={lockIcon}
                    width={16}
                    height={16}
                    className={`absolute lock-icon top-[10px] right-[10px]`}
                  />
                )}
              </span>
              <div className="text-[16px] leading-[22px] font-normal w-[204px] flex-[0_0_auto] relative">
                <div className="sidebar-item hidden w-[175px] !inline-block">{obj?.title}</div>
                {isPrimaryToggle && (
                  <MdOutlineKeyboardArrowDown
                    className={`w-[18px] h-[18px] transition-all duration-300 absolute top-1/2 -translate-y-1/2 right-[10px] justify-end text-white ${showAllProducts ? "" : "rotate-180"
                      } dropdown-icon hidden`}
                  />
                )}
              </div>
            </div>
          </div>
        </Wrapper>
      }
    </div>
  );
};

function NestedSidebar() {
  const {
    activeClientProject
  } = useEbuxContext();

  const role = localStorage.getItem("role");
  let { dataSyncTime } = useSelector((state) => state?.SideBarReducer);
  const location = useLocation();
  // console.log("locationss", location.pathname.split("/")[3]);
  const [menu, setMenu] = useState([]);
  const [openMenu, setOpenMenu] = useState(() => {
    const stored = getLocalSidebarMenu();
    return safeJsonParse(stored, {});
  });
  const [sidebarData, setSidebarData] = useState(
    availableRoutes.filter(
      (item) => {
        if (item?.routePath == '/configuration/:page' || item?.routePath == '/pricing-rule-engine/:page' || item?.routePath == '/alert-control/:page') {
          return item?.routePath?.split('/')?.[1] == location?.pathname?.split('/')?.[1]
        } else {
          return item.routePath === location.pathname
        }
      }
    )
  );

  if (sidebarData?.length === 0) {
    history.push("/dashboard");
  }

  const client_id = activeClientProject?.one_commerce_client_id;
  const clientPermission = safeJsonParse(localStorage.getItem("clientPermission"), []);
  const hasValidRole = clientPermission.some(
    client =>
      client.clientId == activeClientProject?.one_commerce_client_id &&
      client.appRoleAccess.some(
        app =>
          app.appId == 5
      )
  );
  const id_token = localStorage.getItem("id_token");
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  // const client_id = localStorage.getItem("client_id");

  // eslint-disable-next-line no-undef
  let leftNavLinkData = require(
    `../../data/sideNavbar${sidebarData[0]?.sidebar ? sidebarData[0]?.sidebar : "/"
    }NavLinkData.json`
  );
  leftNavLinkData = leftNavLinkData?.filter((item) => {
    return item?.linkPath === "/dashboard" || item?.linkPath === "/alert-control";
  });

  const isActive = (item) =>
    item &&
    (location.pathname === item?.linkPath ||
      item?.menu?.some((child) => location.pathname === child?.linkPath) ||
      //(item?.linkPath && item?.linkPath !== "/" && location.pathname.startsWith(item?.linkPath + "/")) ||
      item?.childNav?.indexOf(location.pathname) > -1
    );

  const toggleOpenMenu = (key) => {
    setOpenMenu((prev) => {
      const updated = { [key]: !prev[key] };
      setLocalSidebarMenu(updated);
      return updated;
    });
  };

  const handleEvent = (item) => {
    // console.log("itemwww", item);
    const pathParts = item.linkPath.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    const eventData = {
      event: "side menu sub",
      eventcategory: "ma side menu dashboard",
      eventaction: "click",
      eventlabel: lastPart,
    };
    console.log(eventData);

    // pushToDataLayerWithEvent(eventData);
  };

  useEffect(() => {
    setSidebarData(
      availableRoutes.filter(
        (item) => {
          if (item?.routePath == '/configuration/:page' || item?.routePath == '/pricing-rule-engine/:page' || item?.routePath == '/alert-control/:page') {
            return item?.routePath?.split('/')?.[1] == location?.pathname?.split('/')?.[1]
          } else {
            return item.routePath === location.pathname
          }
        }
      )
    );
  }, [location.pathname]);

  useEffect(() => {
    let filteredLeftNavLinkData = [];
    const nestedMenuObj = {};
    if (role) {
      const filterMenuItems = (menuItems, userRole) => {
        return menuItems.filter((item) => {
          if (item.roles) {
            return item.roles.includes(userRole);
          }
          return true; // Return whole object if roles key is not present
        });
      };

      filteredLeftNavLinkData = filterMenuItems(
        leftNavLinkData,
        role.toLowerCase()
      );
      filteredLeftNavLinkData.forEach((item) => {
        if (item.menu) {
          nestedMenuObj[item.linkTitle] = false;
        }
      });
    }
    // Only reset openMenu if the role actually changes
    setOpenMenu(() => {
      const stored = getLocalSidebarMenu();
      return safeJsonParse(stored, nestedMenuObj);
    });
    // console.log('filteredLeftNavLinkDatafilteredLeftNavLinkData', filteredLeftNavLinkData)
    setMenu(filteredLeftNavLinkData);
  }, [role]);

  return (
    <div className="text-[#BFBFBF]">
      {menu?.map((item) => {
        const hasChildren = Array.isArray(item.menu) && item.menu.length > 0;
        const topItemClasses = `min-h-[52px] rounded-[10px] group overflow-hidden transition-all duration-300 ${isActive(item)
          ? item?.sidebar === "/dashboard"
            ? "text-flipkartPrimary"
            // : platformTextObj[item?.sidebar?.split("/")[1]]
            : "text-flipkartPrimary"
          : "text-[#BFBFBF]"
          }`;

        return (
          <div key={item.linkTitle}>
            {hasChildren ? (

              ([101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || (((activeClientProject?.useWeightedSOS ?? false) || (activeClientProject?.isBuyBox ?? false)) && item.linkTitle == "Configuration")) ?

                <button
                  type="button"
                  onClick={() => toggleOpenMenu(item.linkTitle)}
                  className={`${topItemClasses} w-full text-left hover:bg-[#39393A] `}
                >
                  <div className="flex items-center w-full rounded-[10px] relative">
                    <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto]">
                      <i className={`text-base ${item.icon}`} />
                    </span>
                    <div className="text-[16px] leading-[22px] font-normal w-[164px] flex-1 flex justify-between relative">
                      <div className="sidebar-item hidden truncate">
                        {item.linkTitle}
                      </div>
                      <MdOutlineKeyboardArrowDown
                        className={`w-[18px] h-[18px] transition-all duration-300 absolute top-1/2 -translate-y-1/2 right-[0px] mr-2 text-white ${openMenu[item.linkTitle] ? "rotate-180" : ""
                          } dropdown-icon hidden`}
                      />
                    </div>
                  </div>
                </button> : <></>
            ) : (item.externalRedirect) ? (
              hasValidRole ? (
                <a
                  href={`${PROJECT_CONFIGURATION_BASE_URL}dashboard?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${topItemClasses} block`}
                >
                  <div className="flex items-center w-full rounded-[10px] relative min-h-[52px] hover:bg-[#39393A]">
                    <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto]">
                      <i className={`text-base ${item.icon}`} />
                    </span>
                    <div className="text-[16px] leading-[22px] font-normal w-[164px] flex-[0_0_auto] relative">
                      <div className="sidebar-item hidden truncate">
                        {item.linkTitle}
                      </div>
                    </div>
                  </div>
                </a>
              ) : null
            )
              : (
                <div>
                  {
                    item.linkPath == "/configuration/buy-box-trends" ?
                      activeClientProject?.isBuyBox ?
                        <Link
                          to={(!item.disable && item.linkPath) || "#"}
                          onClick={() => handleEvent(item)}
                          className={topItemClasses}
                        >

                          <div className="flex items-center w-full rounded-[10px] relative min-h-[52px] hover:bg-[#39393A]">
                            <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto]">
                              {
                                item.icon ? <i className={`text-base ${item.icon}`} /> : <img src={item.imgsrc} alt="" className="w-[24px] h-[28px]" />

                              }

                            </span>
                            <div className="text-[16px] leading-[22px] font-normal w-[164px] flex-[0_0_auto] relative">
                              <div className="sidebar-item hidden truncate">
                                {item.linkTitle}
                                {item.linkTitle === "Synced At:" && (
                                  <span className="text-[13px] pl-1">{dataSyncTime}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link> : <></>
                      :
                      <Link
                        to={(!item.disable && item.linkPath) || "#"}
                        onClick={() => handleEvent(item)}
                        className={topItemClasses}
                      >
                        <div className="flex items-center w-full rounded-[10px] relative min-h-[52px] hover:bg-[#39393A]">
                          <span className="min-w-[58px] h-[52px] flex items-center justify-center rounded-[10px] flex-[0_0_auto]">
                            {
                              item.icon ? <i className={`text-base ${item.icon}`} /> : <i className="fa-regular fa-file-lines"></i>

                            }

                          </span>
                          <div className="text-[16px] leading-[22px] font-normal w-[164px] flex-[0_0_auto] relative">
                            <div className="sidebar-item hidden truncate">
                              {item.linkTitle}
                              {item.linkTitle === "Synced At:" && (
                                <span className="text-[13px] pl-1">{dataSyncTime}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                  }

                </div>
              )}

            {hasChildren && openMenu[item.linkTitle] && ([101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || (((activeClientProject?.useWeightedSOS ?? false) || (activeClientProject?.isBuyBox ?? false)) && item.linkTitle == "Configuration")) && (
              <ChildMenu
                item={item}
                isActive={isActive}
                handleEvent={handleEvent}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const ChildMenu = ({ item, isActive, handleEvent }) => {
  const {
    activeClientProject
  } = useEbuxContext();
  return (
    <div className="mx-[8px] my-2">
      <div className="bg-[#3A3C3E] rounded-[4px]">
        {item.menu.map((child) => {
          if (
            (child.linkTitle === "My Report" ||
              child.linkTitle === "Report Dictionary" ||
              child.linkTitle == "Keyword SOV")
            //   &&
            // !getClient()
          ) {
            return null;
          }

          if ((((activeClientProject?.useWeightedSOS ?? false) == false) && item.linkTitle == "Configuration" && child.linkPath == "/weighted-sos")) {
            return null;
          } else if (([101, 102, 103].indexOf(activeClientProject?.client_project_id) == -1) && item.linkTitle == "Configuration"
            && [...((activeClientProject?.useWeightedSOS ?? false) ? ["/weighted-sos"] : []), ...((activeClientProject?.isBuyBox ?? false) ? ["/configuration/buy-box-seller-settings"] : [])].indexOf(child.linkPath) == -1
          ) {
            return null;
          }

          const active = isActive(child);
          return (
            <Link
              key={child.linkTitle}
              to={(!child.disable && child.linkPath) || "#"}
              onClick={() => handleEvent(child)}
            >
              <div
                className={`flex items-center h-[46px] text-[14px] leading-[20px ${child.disable ? "cursor-not-allowed" : "cursor-pointer"} hover:bg-[#39393A] ${active
                  // ? platformTextObj[child?.linkPath?.split("/")[1]]
                  ? "text-flipkartPrimary"
                  : "text-[#BFBFBF]"
                  }`}
              >
                <div className="min-w-[42px] flex items-center justify-center">
                  <i className={`${child.icon} pl-2`} />
                </div>
                <div
                  className={`sidebar-item hidden h-full truncate pl-3.5 flex-1 ${active
                    ? `border-r-2 
                      ${
                    // platformBorder[child?.linkPath?.split("/")[1]]
                    "border-flipkartPrimary"
                    }
                        `
                    : ""
                    }`}
                >
                  <span className="h-full flex items-center">
                    {child.linkTitle}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};