import React, { useEffect, useState, useRef } from "react";
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
import { useClientPermission } from "../../../context/ClientPermissionContext";
import HeaderDatePicker from "./HeaderDatePicker";
import { BsSliders2 } from "react-icons/bs";
import Drawer from "@mui/material/Drawer";
import DrawerEdit from "./Drawer/DrawerEdit"



const Header1 = ({ setSelected, defaultSelected, open, setOpen, filters }) => {
    const { clientPermission } = useClientPermission();
    // console.log('clientPermission', clientPermission)
    const location = useLocation();
    // eslint-disable-next-line no-unused-vars
    let name;
    let header = availableRoutes?.filter(
        (item) => item.routePath === location.pathname
    );
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
            setActiveClientProject(new_active_client_project);
            window.location.reload();
        }
        setPopup(false);
    }

    const toggleDrawer = (type, newOpen) => () => {
        setOpen({ [type]: newOpen });
    };
    return (
        <>
            <div className="header px-2 pl-6" id="header-custom">

                {/* <img src={egenie} width={30} height={30} />
        <div className="text-[22px] leading-[22px] text-[#333333]"> e-Genie Suite</div> */}
                <div className="font-semibold text-lg leading-[22px] text-[#333333]"> Digital Shelf Management</div>
                <div className="col ">
                    <div className=" header__rightMenu relative">



                        <HeaderDatePicker />
                        <button className="flex flex-row gap-1 border-[1px] border-[#D9D9D9] px-3 py-2.5 rounded-md items-center text-[#000000D9]" onClick={toggleDrawer("edit", true)}><BsSliders2 />Filter</button>
                        <div className=" flex">
                            <div ref={headerDropdown} className="relative">
                                <div className="header__rightMenu--admin ">
                                    <div className="row items-start">
                                        <button
                                            className="header__rightMenu--image"
                                            onClick={() => {
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

                                                <li key={project_index} className="user_options_content" onClick={() => { handle_active_client_project_change(project) }}>
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
                    </div>
                </div>
                <Drawer
                    open={open.edit}
                    onClose={toggleDrawer("edit", false)}
                    anchor={"right"}
                >
                    <DrawerEdit onClose={toggleDrawer("edit", false)} setSelected={setSelected} defaultSelected={defaultSelected} filters={filters} />
                </Drawer>
            </div>
        </>
    );
};
export default Header1;
