import React, { useEffect, useState } from "react";

import {
  GET_NOTIFICATION_STATUS,
  GET_NOTIFICATION_UPDATE,
} from "../../../utils/constants";
import { _POST } from "../../../services/axios.method";
import { useSelector } from "react-redux";

const HeaderTable = ({ ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setIsOpen] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [select, setSelect] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const [IsRead, setIsRead] = useState(false);
  const [selectValue, setSelectValue] = React.useState([]);
  const commonReducer = useSelector((state) => state.CommonReducer);
  const [media_type, setMediaType] = useState(commonReducer.platFormType);
  // const handleChange = (selectedOption) => {
  //   setSelectedItem(selectedOption);
  //   console.log(`Option selected:`, selectedOption);
  // };
  const platform = {
    "/flipkart": ["flipkart"],
    "/blinkit": ["blinkit"],
    "/amazon": ["amazon"],
    // "/commonscreen": ["common screen"],
    "/zepto": ["zepto"],
    "/instamart": ["instamart"],
    all: ["flipkart", "blinkit", "amazon", "zepto", "instamart"],
  };

  const [checkedIds, setCheckedIds] = useState([]);

  React.useEffect(() => {
    let data = selectValue?.map((data) => {
      if (data?._id) {
        return data._id;
      }
      return data.id;
    });
    setCheckedIds(data);
    setIsRead(false);
  }, [selectValue]);

  const UpdateNotificationStatus = async () => {
    // alert("clicked");
    let data = {
      status: 1,
      id: checkedIds,
      platform: localStorage.getItem("notification-platform")
        ? localStorage.getItem("notification-platform")
        : localStorage.getItem("platform_type"),
    };
    await _POST(GET_NOTIFICATION_UPDATE, data);
    // .then((res) => {
    // if (res.status === "Updated calender") {
    //   alert("Approved Status Changed");
    // }
    // });
    // .catch((err) => {
    //   alert(err.message);
    // });
  };

  const readNotification = async (val) => {
    const platformkey = JSON.parse(localStorage.getItem("platforms"));
    const platforms = platformkey.platform;

    // console.log("platformssss", platforms.platform);
    const respp = await _POST(GET_NOTIFICATION_STATUS, {
      status: val,
      media_type: platform[val],
      platforms: platforms,
    });

    setSelectValue(respp?.data?.data);
    setSelect(true);
  };

  useEffect(() => {
    localStorage.removeItem("notification-platform");
    readNotification(commonReducer.platFormType);
    props.getNotificationCount();
  }, []);

  function formatDateTime(item) {
    const dateTime = new Date(item.createdAt);

    if (isNaN(dateTime.getTime())) {
      return "NA";
    }
    if (item.source != "rules") {
      dateTime.setHours(dateTime.getHours() - 5);
      dateTime.setMinutes(dateTime.getMinutes() - 30);
    } else {
      dateTime.setHours(dateTime.getHours());
      dateTime.setMinutes(dateTime.getMinutes());
    }

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = dateTime.getDate();
    const monthIndex = dateTime.getMonth();
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    const formattedDate = `${months[monthIndex]} ${day}, ${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDateTime = `${formattedDate} at ${formattedTime}`;

    return formattedDateTime;
  }

  return (
    <>
      <ul className="dropdown-menu z-50">
        <li className="header">
          <div className="head">
            <select
              onChange={(e) => {
                setMediaType(e.target.value);
                readNotification(e.target.value);
                localStorage.setItem("notification-platform", e.target.value);
                props.getNotificationCount();
              }}
              className="notification text-[14px]"
            >
              {props?.platforms?.length > 1 ? (
                <option value="all" selected={media_type === "all"}>
                  All
                </option>
              ) : null}
              {props.platforms.map((item, key) => (
                <option
                  key={key}
                  value={`/${item}`}
                  selected={media_type === `/${item}`}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </option>
              ))}
              {/* <option value="/flipkart" selected={media_type === "/flipkart"}>
                Flipkart
              </option>
              <option value="/blinkit" selected={media_type === "/blinkit"}>
                Blinkit
              </option>
              <option value="/amazon" selected={media_type === "/amazon"}>
                Amazon
              </option>
              <option value="/zepto" selected={media_type === "/zepto"}>
                Zepto
              </option> */}
              {/* <option
                value="/commonscreen"
                selected={media_type === "/commonscreen"}
              >
                Common Screen
              </option> */}
            </select>
            <div className="notification">
              <h4 className="text-[14px]">Notifications</h4>
            </div>
            <div className="notifications_read">
              <label className="text-[14px]">Mark all as read</label>
              <input
                onClick={() => {
                  // e.preventDefault();
                  UpdateNotificationStatus();
                }}
                type="checkbox"
                checked={IsRead}
                onChange={(e) => {
                  setIsRead(e.target.checked);
                }}
              />
            </div>
          </div>
        </li>

        <li>
          <div className="list">
            <div className="list_menu">
              <li>
                <div
                  className="list_menu_wrap"
                  style={{ overflow: "auto", maxHeight: "200px" }}
                >
                  {selectValue.length > 0 ? (
                    selectValue?.map((item) => {
                      if (item?.createdAt) {
                        const formattedDateTime = formatDateTime(item);

                        return (
                          <div
                            key={item.id}
                            className="row list_menu_item items-center flex pl-8 pr-3"
                          >
                            {/* Avatar code (if uncommented) */}
                            {/* <span className="pr-2 w-1/10">
                            <Avatar
                              src={item.avatarUrl}
                              size="small"
                              circular={true}
                              alt={item.description}
                              {...stringAvatar(item.description)}
                            />
                          </span> */}

                            <span className="">
                              <p>{item.description}</p>
                              <p className="list_col text-[12px]">
                                {formattedDateTime}
                              </p>
                            </span>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="row list_menu_item items-center flex pl-8 pr-3">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </li>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default HeaderTable;
