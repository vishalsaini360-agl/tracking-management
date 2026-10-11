import React from "react";
import { useSelector } from "react-redux";
import "./style.css";

const Toast = ({ children }) => {
  const { toastErrorHandler } = useSelector((state) => state.CommonReducer);
  return (
    <React.Fragment>
      {children}

      {toastErrorHandler &&
        typeof toastErrorHandler.status === "boolean" &&
        toastErrorHandler.message !== "" && (
          <div
            className={[
              "snackbar",
              toastErrorHandler.status == true ? "sucesss" : "danger",
            ].join(" ")}
          >
            <div className="flex pt-2">
              {toastErrorHandler.status == true ? (
                <img src="/assets/images/green_tick.svg" />
              ) : (
                <img src="/assets/images/red_tick.svg" />
              )}
              <h4 className="ml-2">{toastErrorHandler.message}</h4>
            </div>
          </div>
        )}
    </React.Fragment>
  );
};

export default Toast;
