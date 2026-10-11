import { createPortal } from "react-dom";

import ToggleButton from "../button/ToggleButton";
import { useEffect, useState } from "react";
import { ENTITY_TYPE, EVENTS, trackCustomEvent } from "../../../../tracker";
const CompetitionDailog = ({ data = {}, handleRest = () => { }, handleClose = () => { }, loading = false, activePlatform = [], competitionBrand = [] }) => {
    const [search, setSearch] = useState("");
    const [localCompetitionBrand, setLocalCompetitionBrand] = useState(competitionBrand);
    useEffect(() => {

        trackCustomEvent(
            EVENTS.POPUP_OPEN,
            { item: "Competition Dailog" },
            ENTITY_TYPE.POPUP,
            {
                component_type: ENTITY_TYPE.POPUP
            }
        );
        return () => {
            trackCustomEvent(
                EVENTS.POPUP_CLOSE,
                { item: "Competition Dailog" },
                ENTITY_TYPE.POPUP,
                {
                    component_type: ENTITY_TYPE.POPUP
                }
            );
        }
    }, [])

    const selectAllPlatformInRow = (item, status) => {
        setLocalCompetitionBrand((previousData) => {
            const index = previousData?.findIndex((data) => item?.label == data?.label && item?.value == data?.value);
            if (index > -1) {
                if (!status) {
                    previousData[index].selected_platform = [...previousData[index].platform, 0];
                } else {
                    previousData[index].selected_platform = [];
                }
            }
            return [...previousData];
        })
    }
    const isAllRowHavePlatform = (pf_id) => {
        let ret = -1;
        if (!localCompetitionBrand?.length) {
            ret = -1;
        }
        localCompetitionBrand?.forEach((data) => {
            // if (data?.status && data?.platform?.includes(pf_id)) {
            if (pf_id == 0 || data?.platform?.includes(pf_id)) {
                if (ret == -1) {
                    ret = 1;
                }
                if (!data?.selected_platform?.includes(pf_id)) {
                    ret = 0;
                }
            }
        })
        return ret;
    }
    const selectAllPlatformInCol = (pf_id) => {
        setLocalCompetitionBrand((previousData) => {
            const updatedData = previousData.map((data) => {
                if ((pf_id == 0 || data.platform.includes(pf_id)) && !data.selected_platform.includes(pf_id)) {
                    return {
                        ...data,
                        selected_platform: [...data.selected_platform, pf_id],
                    };
                }
                return data;
            });
            return updatedData;
        });
    };

    const removeAllPlatformInCol = (pf_id) => {
        setLocalCompetitionBrand((previousData) => {
            const updatedData = previousData.map((data) => {
                if ((pf_id == 0 || data.platform.includes(pf_id))) {
                    return {
                        ...data,
                        selected_platform: data.selected_platform.filter(
                            (id) => id !== pf_id
                        ),
                    };
                }
                return data;
            });
            return updatedData;
        });
    };
    const platformStatusUpdate = (item, pf_id) => {
        setLocalCompetitionBrand((previousData) => {
            const index = previousData?.findIndex((data) => item?.label === data?.label && item?.value === data?.value);
            if (index > -1) {
                if (!previousData[index]?.selected_platform) {
                    previousData[index].selected_platform = []; //define selected_platform if not in
                }

                if (previousData[index].selected_platform?.includes(pf_id)) {
                    previousData[index].selected_platform = previousData[index].selected_platform?.filter((id) => id != pf_id)

                } else {
                    previousData[index].selected_platform.push(pf_id);
                }
            }
            return [...previousData];

        })
    }

    const handleBackgroundClick = (event) => {
        // Check if the click is outside the dialog (on the overlay)
        if (event.target.classList.contains("modal-overlay")) {

            // handleClose();
        }
    };

    const getPFHeader = (pf) => {
        const pfStatus = isAllRowHavePlatform(pf?.value)
        return (<div className="flex items-center gap-2">{pf?.label}

            <ToggleButton
                my_style={{ cursor: (pfStatus == -1) ? "not-allowed" : "pointer" }}
                disabled={pfStatus == -1}
                is_verified={true}
                status={(pfStatus == 1)}
                triggerHandler={(status) => (status ? removeAllPlatformInCol(pf?.value) : selectAllPlatformInCol(pf?.value))}
            />
            {/* {pfStatus == 1 ?
                (<input
                    checked={true}
                    onChange={() => removeAllPlatformInCol(pf?.value)}
                    type="checkbox"
                    className="tbl_checkbox"
                />)
                :
                (<input
                    style={{ cursor: (pfStatus != -1) ? "pointer" : "not-allowed" }}
                    disabled={pfStatus == -1}
                    checked={false}
                    onChange={() => selectAllPlatformInCol(pf?.value)}
                    type="checkbox"
                    className="tbl_checkbox"
                />)
            } */}


        </div>)
    };


    return createPortal(
        <div
            className="modal-overlay w-full h-full bg-black/20 absolute top-0 z-[500] flex justify-center items-center"
            onClick={handleBackgroundClick}
        >
            <div
                className="rounded-xl border bg-card text-card-foreground shadow md:max-w-[75%] max-w-full bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col space-y-1.5 p-6 text-center sm:text-left">
                    <h2 className="mb-2 text-lg font-semibold">
                        {`Select Competition of Brand: ${data?.brand_name ?? "-"}`}
                    </h2>
                    <div className="competitionPopupWrap">
                        <div className="competitionSearchOuter">
                            <img src="/assets/images/searchIcon.svg" className="search_icon" alt="x" />
                            <input
                                type="text"
                                className="search_input"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="competitionTblOuter">
                            <table border={0} className="competitionTbl">
                                <thead>
                                    <tr>
                                        {activePlatform?.length > 1 ? <th className="w-24 min-w-24 sticky-col sticky-col-0 sticky-header-vertical"
                                            style={{ position: "sticky", left: 0, top: 0, zIndex: 5, background: "#fff" }}
                                        >&nbsp;</th> : ""}
                                        <th className="sticky-col sticky-col-1 sticky-header-vertical"
                                            style={{ position: "sticky", left: activePlatform?.length > 1 ? 65 : 0, top: 0, zIndex: 5, background: "#fff" }}
                                        >Competition Brands</th>
                                        {
                                            activePlatform?.map((pf) => (
                                                <th key={pf?.value} className="sticky-header">
                                                    {getPFHeader(pf)}
                                                </th>))
                                        }
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading
                                        ? (<tr><td colSpan={(activePlatform?.length ?? 0) + (2)}>Loading...</td></tr>)
                                        : localCompetitionBrand?.map((item, i) => (
                                            (search == "" || (item.label?.toLowerCase()?.includes(search?.toLowerCase())))
                                                ?
                                                (<tr key={i}>
                                                    {activePlatform?.length > 1 ?
                                                        (<td className="w-12 min-w-12 text-center sticky-col sticky-col-0">
                                                            {/* <input

                                                                style={{ cursor: ((item?.status ?? false)) ? "pointer" : "not-allowed" }}
                                                                disabled={(!(item?.status ?? false))}
                                                                type="checkbox"
                                                                className="tbl_checkbox"
                                                                checked={(item?.selected_platform?.length == item?.platform?.length)}
                                                                onChange={() => selectAllPlatformInRow(item, (item?.selected_platform?.length == item?.platform?.length))}
                                                            /> */}
                                                            <ToggleButton
                                                                my_style={{ cursor: "pointer" }}
                                                                disabled={(false)}
                                                                is_verified={true}
                                                                status={(item?.selected_platform?.length == (item?.platform?.length + 1))}
                                                                triggerHandler={() => selectAllPlatformInRow(item, (item?.selected_platform?.length == (item?.platform?.length + 1)))}
                                                            />
                                                        </td>)
                                                        : ""}
                                                    <td className="sticky-col sticky-col-1" style={{ left: activePlatform?.length > 1 ? 65 : 0 }}>
                                                        <div className={`competitionBrand ${item?.status ? "competition_active" : ""} `}>
                                                            {item.label}
                                                        </div>
                                                    </td>

                                                    {
                                                        activePlatform?.map((pf) => (
                                                            <td key={pf?.value}>
                                                                {/* <input

                                                                    style={{ cursor: ((!(item?.status ?? false)) || (!item?.platform?.includes(pf?.value)) ? "not-allowed" : "pointer") }}
                                                                    disabled={((!(item?.status ?? false)) || (!item?.platform?.includes(pf?.value)))}
                                                                    checked={item?.selected_platform?.includes(pf?.value)}
                                                                    type="checkbox"
                                                                    className="tbl_checkbox"
                                                                    onChange={() => platformStatusUpdate(item, pf?.value)}
                                                                /> */}

                                                                <ToggleButton
                                                                    my_style={{ cursor: (pf?.value > 0 && (!item?.platform?.includes(pf?.value)) ? "not-allowed" : "pointer") }}
                                                                    disabled={(pf?.value > 0 && (!item?.platform?.includes(pf?.value)))}
                                                                    is_verified={true}
                                                                    status={(item?.selected_platform?.includes(pf?.value)) ?? false}
                                                                    triggerHandler={() => platformStatusUpdate(item, pf?.value)}
                                                                />
                                                            </td>
                                                        ))
                                                    }
                                                </tr>)
                                                : ""
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>

                <div className="items-center p-6 pt-0 flex justify-end gap-2">
                    <button
                        onClick={() => handleRest()}
                        className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
                    >
                        Cancel
                    </button>
                    {/* <button
                        onClick={()=>handleClose()}
                        className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
                    >
                        Close
                    </button> */}
                    <button

                        onClick={() => handleClose(localCompetitionBrand)}
                        type="submit"
                        className="applyBtn"
                    // className={`bg-[#e53a3a] rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default CompetitionDailog;
