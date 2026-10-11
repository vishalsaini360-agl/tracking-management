import React, { useRef, useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import { CSVLink } from "react-csv";

const ExportButton = ({
  platform,
  setShowCsvPopup,
  showCsvPopup,
  option,
  setOption,
  apply,
  loading,
  campaignReportData,
  source,
  downloadHeader,
  title,
}) => {
  const dropDownRef = useRef(null);
  const [error, setError] = React.useState(false);
  const handleChange = (event) => {
    setOption(event.target.value);
  };
  // eslint-disable-next-line no-unused-vars
  const [csvHeaders, setCsvHeaders] = React.useState([
    { label: "Date", key: "daterange" },
  ]);
  const handleClickOutside = (event) => {
    if (
      // showCsvPopup &&
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target)
    ) {
      setShowCsvPopup(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="pl-2 relative " ref={dropDownRef}>
        <button
          className={[
            "exportbutton",
            platform === "blinkit" && "exportbtnblinkit",
          ].join(" ")}
          onClick={() => {
            setShowCsvPopup(!showCsvPopup);
          }}
          // disabled={true}
        >
          <DownloadIcon />
          Export
          {/* <CSVLink data={data} headers={headers} filename={`${title}_${Date.now()}.csv`}>Export</CSVLink> */}
        </button>
        {error ? (
          <p className="errorText">No data available to export</p>
        ) : null}
        {showCsvPopup && (
          <div className="exportCSVPopUp">
            <h6 className="text-base font-semibold py-2 ">
              Export CSV file only
            </h6>

            <label className="text-sm pb-2">
              <input
                type="radio"
                value="Monthly"
                checked={option === "Monthly"}
                onChange={handleChange}
                className=""
              />
              Monthly
            </label>
            <label className="text-sm pb-2">
              <input
                type="radio"
                value="Weekly"
                checked={option === "Weekly"}
                onChange={handleChange}
              />
              Weekly
            </label>
            <label className="text-sm pb-2">
              <input
                type="radio"
                value="Daily"
                checked={option === "Daily"}
                onChange={handleChange}
              />
              Daily
            </label>
            <label className="text-sm pb-2">
              <input
                type="radio"
                value="Cumulative"
                checked={option === "Cumulative"}
                onChange={handleChange}
              />
              Cumulative
            </label>
            <div className="exportbtncontainer ">
              <div>
                <button
                  className="exporttncancel rounded"
                  onClick={() => {
                    setShowCsvPopup(false);
                    setOption(null);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="exportdownloadbt rounded "
                  onClick={apply}
                  disabled={loading}
                >
                  {/* <CSVLink
                        data={data}
                        headers={headers}
                        filename={`${title}_${Date.now()}.csv`}
                        onClick={(event) => {
                          if (option == null) {
                            return false;
                          }
                          return true;
                        }}
                      >
                        Download
                      </CSVLink> */}

                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <CSVLink
                      data={campaignReportData}
                      headers={
                        source === "blinkit" ? downloadHeader : csvHeaders
                      }
                      filename={`${title}_${Date.now()}.csv`}
                      onClick={() => {
                        if (option == null) {
                          return false;
                        }
                        if (campaignReportData.length == 0) {
                          setError(true);
                          return false;
                        }
                        return true;
                      }}
                    >
                      Download
                    </CSVLink>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ExportButton;
