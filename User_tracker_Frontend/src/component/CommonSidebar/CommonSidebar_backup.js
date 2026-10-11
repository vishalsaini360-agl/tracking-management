import { useEffect, useState } from "react";
import { navList } from "./constant.js";
import lockIcon from "./icons/lock.svg";
import "./style.css";

import { _GETWIthToken } from "../../services/axios.method.js";
import { ONECOMMERCE_GET_PROJECT_API_URL } from "../../utils/constants.js";
import {
  IDENTITY_MODULE_BASE_URL,
  ONECOMMERCE_URL
} from "../../utils/url.js";
import { Link } from "react-router-dom";


const CommonSidebar = ({ children }) => {
  const [activeLink, setActiveLink] = useState(2);
  const [localList, setLocalList] = useState([]);
  const [enableAllList, setEnableAllList] = useState(false);
  const [list, setList] = useState([]);

  const id_token = localStorage.getItem("id_token");
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const client_id = localStorage.getItem("client_id");

  useEffect(() => {
    (async () => {
      try {
        const url = IDENTITY_MODULE_BASE_URL + ONECOMMERCE_GET_PROJECT_API_URL;
        const res = await _GETWIthToken(url);
        const projects = res?.data?.data?.app;

        // eslint-disable-next-line no-console
        console.log("Project List", { projects });

        let newList = navList.map((el) => {
          let pro = projects.find((e) => e.appName === el.title);
          const lock = (pro?.permission === undefined) ? false : !pro?.permission;
          return {
            ...el,
            appId: pro?.id,
            rollId: pro?.rollId,
            sort: pro?.sort,
            projectDescription: pro?.projectDescription,
            url: (!lock && pro?.url) ? pro?.url : el.staticPageURL,
            lock,
          };
        });
        newList.sort((a, b) => (a.sort ?? Infinity) - (b.sort ?? Infinity));

        // eslint-disable-next-line no-console        
        console.log("Project List", { newList });
        setList(newList.filter((item) => item.dsNavType));
        setLocalList(newList.filter((item) => item.bottomNavType));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    })();
  }, []);

  // eslint-disable-next-line no-console

  const handleEnableAllLIst = () => {
    setEnableAllList(prev => !prev);
  };
  return (
    <div className="flex bg-[#545658] relative justify-end">
      <div
        className="sidebar w-[94px] hover:w-[280px] h-[100vh] bg-[#242627] overflow-hidden py-1 transition-all duration-300 absolute left-0 top-0 z-[99999999]">
        <div className="sidebar-logo h-[81px] pt-1 px-[8px]">

          <a
            href={
              `${ONECOMMERCE_URL}`}
          // (!obj?.lock && !([5].indexOf(obj?.id) > -1)) ? `${obj.url}?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}` : `${ONECOMMERCE_URL}${obj.staticPageURL}`}
          >
            <div className="border-b border-[#39393A] pb-3 flex items-center cursor-pointer" >
              <div className="w-[74px] flex justify-center flex-[0_0_auto]">
                <img src="/assets/images/logo.svg" alt="" className="w-[50px] h-[56px]" />
              </div>
              <div className="w-[179px] h-[42px] flex-[0_0_auto]">
                <div className="sidebar-item hidden">
                  <p className="text-[16px] leading-[22px] font-medium text-[#FFFFFF]">e-Genie </p>
                  <p className="text-[16px] leading-[22px] font-medium text-[#FFFFFF]">OneCommerce Suite</p>
                </div>
              </div>
            </div>
          </a>

        </div>
        {
          list.length > 0 && (
            <div className="sidebar-nav h-[calc(100vh_-76px)] overflow-y-auto overflow-x-hidden pl-[10px] pr-[10px] pt-2">
              <div className="bg-[#2E3133] rounded-[10px] p-[8px] mb-3 cursor-pointer text-[#BFBFBF]">
                {list?.sort((a, b) => a.sort - b.sort)
                  .map((obj) => {
                    return (
                      <SideLink
                        key={obj?.id}
                        obj={obj}
                        enableAllList={enableAllList}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}
                        id_token={id_token}
                        access_token={access_token}
                        refresh_token={refresh_token}
                        client_id={client_id}
                        handleEnableAllLIst={handleEnableAllLIst}
                      />
                    );
                  })}
              </div>

              <div className="ds-local-nav-link px-[8px]">
                {localList?.sort((a, b) => a.sort - b.sort)
                  .map((obj) => {
                    return (
                      <LocalSideLink
                        key={obj?.id}
                        obj={obj}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}
                        id_token={id_token}
                        access_token={access_token}
                        refresh_token={refresh_token}
                        client_id={client_id}
                      />
                    );
                  })}
              </div>
            </div>
          )
        }

      </div>
      {children}
    </div>
  );
};

export default CommonSidebar;

const SideLink = (
  {
    obj,
    enableAllList,
    activeLink,
    id_token,
    access_token,
    refresh_token,
    client_id,
    handleEnableAllLIst
  }
) => {
  const isPrimaryToggle = obj.id === 2;
  if (!enableAllList && !isPrimaryToggle) return null;

  const href =
    isPrimaryToggle
      ? "/dashboard"
      : !obj.lock && ![5].includes(obj.id)
        ? `${obj.url}?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}`
        : `${ONECOMMERCE_URL}${obj.staticPageURL}`;

  const Wrapper = isPrimaryToggle ? Link : "a"; // choose between Link and <a />
  return (

    <div >
      {
        // <Link
        //   to={href}
        //   onClick={isPrimaryToggle ? handleEnableAllLIst : undefined}
        // >
        <Wrapper
        {...(isPrimaryToggle
          ? { to: href, onClick: handleEnableAllLIst }
          : { href, target: "_blank", rel: "noopener noreferrer" })}
      >
          <div className={`h-[60px] rounded-[10px] mb-3 mt-3 group overflow-hidden
                            transition-[all] duration-300 text-[#BFBFBF] ${activeLink === obj?.id ? " menuActive universal-active" : ""
            }`}
          >
            <div className="flex items-center w-full rounded-[10px] relative">
              <span className="w-[56px] h-[60px] flex items-center justify-center rounded-[10px] flex-[0_0_auto] relative">
                {obj?.icon()}
                {(obj?.lock) && (
                  <img
                    src={lockIcon}
                    width={16}
                    height={16}
                    className={`absolute lock-icon top-[10px] right-[10px]
            `}
                  />
                )}
              </span>
              <div
                className="text-[16px] leading-[22px] font-normal w-[164px] flex-[0_0_auto] relative">
                <div className="sidebar-item hidden">
                  {obj?.title}
                </div>
                {isPrimaryToggle ? <img src="/assets/images/angle-up.svg"
                  className={`w-[16px] h-[16px] transition-all duration-300 absolute top-1/2 -translate-y-1/2 right-[0px] ${enableAllList ? "" : "rotate-180"} dropdown-icon hidden`}
                  alt="" /> : ""}
              </div>

            </div>
          </div>
        </Wrapper>
      }

    </div>
  );
};

const LocalSideLink = (
  {
    obj,
    activeLink,
    // id_token,
    // access_token,
    // refresh_token,
    // client_id
  }
) => {
  return (
    <div >
      <Link
        to={
          `${obj.staticPageURL}`}
      // (!obj?.lock && !([5].indexOf(obj?.id) > -1)) ? `${obj.url}?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}` : `${ONECOMMERCE_URL}${obj.staticPageURL}`}
      >
        <div className={`h-[60px] rounded-[10px] mb-3 group overflow-hidden
                            transition-[all] duration-300 text-[#BFBFBF] ${activeLink === obj?.id ? " menuActive universal-active" : ""
          }`} >
          <div className="flex items-center w-full rounded-[10px] relative menuActive-local-app universal-active">
            <span className="w-[56px] h-[60px] flex items-center justify-center rounded-[10px] flex-[0_0_auto] relative">
              {obj?.icon()}
              {(obj?.lock) && (
                <img
                  src={lockIcon}
                  width={16}
                  height={16}
                  className={`absolute lock-icon top-[10px] right-[10px]
            `}
                />
              )}
            </span>
            <div
              className="text-[16px] leading-[22px] font-normal w-[154px] flex-[0_0_auto]">
              <div className="sidebar-item hidden">
                {obj?.title}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};