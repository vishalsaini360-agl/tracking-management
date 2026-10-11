import React from "react";
import { Link, useLocation } from "react-router-dom";
import Badge from "../badge/Badge";
import { useSelector } from "react-redux";
import { PROJECT_CONFIGURATION_BASE_URL } from "../../../utils/url";
import { useEbuxContext } from "../../Ebux/Context/EbuxProvider";


const NavLinks = ({
  as,
  linkTitle,
  linkPath,
  submenu,
  disable,
  badge,
  icon,
  platform,
  expand,
  navTitle,
  externalRedirect,

  // walletBalance,
}) => {
  const {
    activeClientProject
} = useEbuxContext();

  let { walletBalance } = useSelector((state) => state?.SideBarReducer);
  let { instamartWalletBalance } = useSelector(
    (state) => state?.InstamartSideBarReducer
  );

  let { dataSyncTime } = useSelector((state) => state?.SideBarReducer);
  const location = useLocation();
  const currency = localStorage.getItem("currency");

  const isActive = location.pathname === linkPath;
  let currency_format = localStorage.getItem("currency_format");

  const id_token = localStorage.getItem("id_token");
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const client_id = activeClientProject?.one_commerce_client_id;
  const clientPermission = JSON.parse(localStorage.getItem("clientPermission") || "[]");
  const hasValidRole = clientPermission.some(
    client =>
      client.clientId == activeClientProject?.one_commerce_client_id &&
      client.appRoleAccess.some(
        app =>
          app.appId == 5
      )
  );
  // console.log("hasValidRole", hasValidRole,externalRedirect);
return (
  <>
    {as === "link" ? (
      <li
        className={[
          "liclass",
          !linkTitle && "px-0",
          disable && "cursor-not-allowed",
          platform === "/amazon" && "liclass--ams",
          platform === "/blinkit" && "liclass--blinkit",
          platform === "/instamart" && "liclass--instamart",
          platform === "/zepto" && "liclass--zepto",
          platform === "/dashboard" && "liclass",
          isActive && "active",
          hasValidRole==false && externalRedirect==true &&  "hidden"
        ].join(" ")}
      >
       {(externalRedirect || linkPath.startsWith("http")) ? (
        
        hasValidRole && (
            <a
            href={`${PROJECT_CONFIGURATION_BASE_URL}dashboard?client_id=${client_id}&id_token=${id_token}&access_token=${access_token}&refresh_token=${refresh_token}`}
            className="group"
            target="_blank"
            rel="noopener noreferrer"
          >
          <div
            className={
              disable
                ? "cursor-not-allowed liclass__link w-full"
                : "liclass__link w-full"
            }
          >
            <div className={!linkTitle && "mx-auto w-full text-center"}>
              <i className={icon}></i>
              {/* <img src={imgsrc} alt="" className="mx-auto" /> */}
            </div>
            {!expand && (
            <div
              className="absolute left-[74%] ml-2 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none whitespace-nowrap z-[150] border-2 border-gray-800"
            >
              {navTitle}
            </div>
            )}
            {linkTitle === "Wallet Balance: " && platform === "/flipkart" ? (
              <div className={`ilclass-sidenav cursor-default ${expand && "opacity-100"} mainlayout__transition`}>
                {linkTitle}
                {`${currency} ${walletBalance?.toLocaleString(
                  currency_format
                )}`}
              </div>
            ) : linkTitle === "Remaining Bal: " &&
              platform === "/instamart" ? (
              <div className={`ilclass-sidenav cursor-default ${expand && "opacity-100"} mainlayout__transition`}>
                {linkTitle}
                {`${currency}${instamartWalletBalance?.toLocaleString(
                  currency_format
                )} `}
              </div>
            ) : linkTitle === "Synced At:" ? (
              <div className={`ilclass-sidenav  cursor-default flex ${expand && "opacity-100"} mainlayout__transition`}>
                <div className={`mr-1`}>{linkTitle}</div>
                <div className="text-[14px]">{dataSyncTime}</div>
              </div>
            ) : (
              <div className={`ilclass-sidenav ${expand && "opacity-100"} mainlayout__transition `}>{linkTitle}</div>
              
            )}

            {badge && <Badge text={badge} />}
             
          </div>
          
        </a>)
            )
          :
          (
        <Link to={!disable && linkPath} className="group">
          <div
            className={
              disable
                ? "cursor-not-allowed liclass__link w-full"
                : "liclass__link w-full"
            }
          >
            <div className={!linkTitle && "mx-auto w-full text-center"}>
              <i className={icon}></i>
              {/* <img src={imgsrc} alt="" className="mx-auto" /> */}
            </div>
            {!expand && (
            <div
              className="absolute left-[74%] ml-2 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none whitespace-nowrap z-[150] border-2 border-gray-800"
            >
              {navTitle}
            </div>
            )}
            {linkTitle === "Wallet Balance: " && platform === "/flipkart" ? (
              <div className={`ilclass-sidenav cursor-default ${expand && "opacity-100"} mainlayout__transition`}>
                {linkTitle}
                {`${currency} ${walletBalance?.toLocaleString(
                  currency_format
                )}`}
              </div>
            ) : linkTitle === "Remaining Bal: " &&
              platform === "/instamart" ? (
              <div className={`ilclass-sidenav cursor-default ${expand && "opacity-100"} mainlayout__transition`}>
                {linkTitle}
                {`${currency}${instamartWalletBalance?.toLocaleString(
                  currency_format
                )} `}
              </div>
            ) : linkTitle === "Synced At:" ? (
              <div className={`ilclass-sidenav  cursor-default flex ${expand && "opacity-100"} mainlayout__transition`}>
                <div className={`mr-1`}>{linkTitle}</div>
                <div className="text-[14px]">{dataSyncTime}</div>
              </div>
            ) : (
              <div className={`ilclass-sidenav ${expand && "opacity-100"} mainlayout__transition `}>{linkTitle}</div>
              
            )}

            {badge && <Badge text={badge} />}
             
          </div>
          
        </Link>
          )
        }
       
      </li>
    ) : (
      <li
        className={[
          "text-center text-sm menu liclass min-w-full cursor-default",
          !linkTitle && "px-0",
          platform === "/amazon" && "liclass--ams",
          platform === "/blinkit" && "liclass--blinkit",
          platform === "/zepto" && "liclass--zepto",
          platform === "/instamart" && "liclass--instamart",
          platform === "/dashboard" && "liclass",
        ].join(" ")}
      >
        {/* <Link to={linkPath}> */}
        <div className="liclass__link w-full">
          <div className={!linkTitle && "mx-auto w-full"}>
            <i className={icon}></i>
            {/* <img src={imgsrc} alt="" className="mx-auto" /> */}
          </div>

          <div className={`${expand && "opacity-100"} mainlayout__transition`}>{linkTitle}</div>
          
        </div>
        {/* </Link> */}
        <div className="submenu">
          <ul>
            {submenu.map((item, i) => (
              <li
                key={i}
                className={[
                  "submenuli",
                  location.pathname === item.linkPath && "active",
                ].join(" ")}
              >
                <Link to={item.linkPath} key={i}>
                  <div className="submenuli__link">
                    <div>
                      {/* <Icon /> */}
                      <i className={item.icon}></i>
                      {/* <img src={item.imgsrc} alt="" /> */}
                    </div>
                    <div>{item.linkTitle}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    )}
  </>
);

};

export default NavLinks;
