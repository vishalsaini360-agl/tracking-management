import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import availableRoutes from "../../../routes/availableRoutes";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const SideNav = ({ expand }) => {
  const location = useLocation();
  const history = useHistory();
  const [sidebarData, setSidebarData] = useState(
    availableRoutes.filter((item) => item.routePath === location.pathname)
  );
  const user_info = useSelector((state) => state.AuthReducer);
  // console.log("sidebar::::", sidebarData[0]);
  // const [walletBalance, setWalletBalance] = useState("");

  // const walletBalanceApi = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await _GET(WALLET_BALANCE);
  //     setLoading(false);
  //     let walletBalArray = result?.data?.data?.data?.map(
  //       (item) => item?.wallet_amt
  //     );
  //     let walletBal = walletBalArray?.reduce(
  //       (accumulator, currentValue) => accumulator + currentValue,
  //       0
  //     );
  //     setWalletBalance(Math.floor(walletBal));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   walletBalanceApi();
  // }, []);

  useEffect(() => {
    setSidebarData(
      availableRoutes.filter((item) => item.routePath === location.pathname)
    );
  }, [location.pathname]);

  if (sidebarData.length === 0) {
    history.push("/flipkart");
  }

  // eslint-disable-next-line no-undef
  let leftNavLinkData = require(
    `../../../data/sideNavbar${
      sidebarData[0]?.sidebar ? sidebarData[0]?.sidebar : "/"
    }NavLinkData.json`
  );

  const filterMenuItems = (menuItems, userRole) => {
    return menuItems.filter((item) => {
      if (item.roles) {
        return item.roles.includes(userRole);
      }
      return true; // Return whole object if roles key is not present
    });
  };

  // Filtered menu items
  let filteredLeftNavLinkData = [];
  if (user_info?.role)
    filteredLeftNavLinkData = filterMenuItems(
      leftNavLinkData,
      user_info?.role.toLowerCase()
    );

  return (
    <>
      {/* <div
        className="sideNavOuter"
        style={{ width: expand ? "250px" : "50px" }}
      > */}
      <div>
        <ul className="w-full">
          {/* <li
            className={["p-4 text-white font-semibold", !expand && "px-0"].join(
              " "
            )}
          > */}
          <li
            className={["p-3 text-white font-semibold", !expand && "px-0"].join(
              " "
            )}
          >
            <Link to={"/"}>
              {expand ? (
                // <img
                //   key={expand ? "expanded" : "collapsed"}
                //   src="/assets/images/ebux-logo-white.png"
                //   alt="logo"
                //   style={{
                //     width: expand ? 140 : "0",
                //     height: expand ? "auto" : "0",
                //     transition:
                //       "width 0.5s ease-in-out, height 0.5s ease-in-out",
                //   }}
                // />
                <div className="text-center text-lg"
                  key={expand ? "expanded" : "collapsed"}
                  style={{
                    transition:
                      "width 0.5s ease-in-out, height 0.5s ease-in-out",
                  }}>
                  {/* <img
                    src="/assets/images/ebux-logo-white-mini.png"
                    alt="logo"
                    className="mx-auto w-[23px] h-[25px]"
                    loading="lazy"
                  />*/ <span className="logoTitle">Digital Shelf Management</span> }
                </div>
              ) : (
                <>
                  {/* <img
                    src="/assets/images/ebux-logo-white-mini.png"
                    alt="Lmini"
                    className="mx-auto w-[23px] h-[25px]"
                    loading="lazy"
                  /> */}
                </>
              )}
            </Link>
          </li>
          {filteredLeftNavLinkData.map((item, i) => {
            return (
              
              <NavLinks
                key={i}
                linkTitle={expand && item.linkTitle}
                linkPath={item.linkPath}
                as={item.as}
                submenu={item.menu}
                imgsrc={item.imgsrc}
                badge={expand && item.badge}
                icon={item.icon}
                disable={item.disable}
                platform={sidebarData[0]?.sidebar}
                expand={expand}
                navTitle={item.linkTitle}
                externalRedirect={item.externalRedirect}
                // walletBalance={walletBalance}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default SideNav;
