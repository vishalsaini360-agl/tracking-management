/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
// import SideNav from "./SideNav";
import availableRoutes from "../../../routes/availableRoutes";
import { useDispatch, useSelector } from "react-redux";
import { collapse, firstcollapse } from "../../../redux/action-creator/sideBarAction";
// import CommonHeader  from '../../CommonSidebar/CommonHeader';
import './style.css'

// import openDrawerIcon from "./icons/openDrawer.svg";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [expand, setExpand] = useState(true);
  //eslint-disable-next-line no-console
  const [sidebarData, setSidebarData] = useState([]);
  useEffect(() => {
    const dataForSidebar = availableRoutes.filter(
      (item) => {
        if (item?.routePath == '/configuration/:page' || item?.routePath == '/pricing-rule-engine/:page' || item?.routePath == '/alert-control/:page') {
          return item?.routePath?.split('/')?.[1] == location?.pathname?.split('/')?.[1]
        } else {
          return item.routePath === location.pathname
        }
      }

    );
    setSidebarData(dataForSidebar);
  }, []);

  useEffect(() => {
    const dataForSidebar = availableRoutes.filter(
      (item) => {
        if (item?.routePath == '/configuration/:page' || item?.routePath == '/pricing-rule-engine/:page' || item?.routePath == '/alert-control/:page') {
          return item?.routePath?.split('/')?.[1] == location?.pathname?.split('/')?.[1]
        } else {
          return item.routePath === location.pathname
        }
      }
    );
    setSidebarData(dataForSidebar);


  }, [location.pathname]);

  useEffect(() => {
    dispatch(firstcollapse(false))
  }, [location.pathname])

  // useEffect(()=>{
  //   let tempPlateform = "/"
  //   switch (location.pathname) {
  //     case location.pathname.startsWith("/"):
  //       tempPlateform = "/flipkart"
  //       break;
  //     case location.pathname.startsWith("/flipkart"):
  //       tempPlateform = "/flipkart"
  //       break;
  //     case location.pathname.startsWith("/amazon"):
  //       tempPlateform = "/amazon"
  //       break;
  //     default:
  //       tempPlateform = "/"
  //       break;
  //   }
  //   // setPlatform(location.pathname)
  //   setPlatform(tempPlateform)
  // },[location.pathname])

  const expandState = useSelector((state) => state.SideBarReducer.expandState);
  const firstexpandState = useSelector((state) => state.SideBarReducer.firstexpandState);

  // const expandState = false;

  const dispatch = useDispatch();
  // const setExpandState = ()=>{
  //   dispatch(collapse())
  // }
  return (
    <>
      {/* <div className=" mainlayout w-[calc(100vw_-94px)]"> */}
      <div className=" mainlayout w-[calc(100vw_-97px)]">
        {/* <div className="row border-2">
             <Header/> 
            </div> */}

        {/* <div className="mainlayout__sidenav">
          <div className={`sideNavOuter ${expand ? 'collapsed' : 'expanded'}`}>
            <SideNav
              // expand={true}
              expand={expandState}
              platform={platform}
              setPlatform={setPlatform}
              data={sidebarData}
            />
            <div className="sidebarArrowBtnWrap" onClick={() => {
              setExpand(!expand);
              dispatch(collapse(expand));
            }}>
              <button className="sidebarArrowBtn" type="button" >
                <img
                
          src={openDrawerIcon}
          width={14}
          height={53}
                  // src="/assets/images/sidebarArrow.svg"
                  alt="Sidebar"
                  loading="eager"
                />
              </button>
            </div>
          </div>
        </div> */}

        <div id="mainlayout__main_page"
          className="col overflow-auto bg-[#F0F2F5]"
          style={{ maxHeight: "100vh" }}

        >


          <div className={`${firstexpandState && expandState
            ? "custom-width"
            : firstexpandState && !expandState
            && "custom-full-width"

            }`}>
            <Header
              // expand={true}
              expand={expandState}
              // setExpand={setExpand}
              setExpand={() => {
                setExpand(!expand);
                dispatch(collapse(expand));
              }}
              platform={sidebarData?.[0]?.sidebar || "/dashboard"}
            />
            {/* <CommonHeader/>
         <div className="mt-4 mx-6 z-[500] sticky top-0 right-0"> <Header
            // expand={true}
            expand={expandState}
            // setExpand={setExpand}
            setExpand={() => {
              setExpand(!expand);
              dispatch(collapse(expand));
            }}
            platform={sidebarData[0].sidebar}
            setPlatform={setPlatform}
          /></div> */}
            <div className="p-3">{children}</div>
          </div>
          {/* <SelectDropDrown/> */}
          {/* <AmazonTable/> */}
          {/* <CampBar/> */}
        </div>
      </div>

    </>
  );
};
export default MainLayout;
