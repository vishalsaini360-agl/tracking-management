import React from "react";
import "./styles.css"; // Import CSS for styling
import Button from "../button/Button";
import { useSelector } from "react-redux";
const Drawer = ({
  isOpen,
  children,
  title,
  handleDrawerButton,
  handleCancelChanges,
}) => {
  const {platFormType}=useSelector((state)=>state?.CommonReducer)
  return (
    <div className={`drawer ${isOpen ? "open" : ""} z-[9999] `}>
      <div className="flex p-10 items-center">
        <div className="mr-2">
          <img
            src="/assets/images/slidearrow.svg"
            alt=""
            style={{ width: 14, cursor: "pointer" }}
            onClick={handleCancelChanges}
          />
        </div>
        <div className="drawer-title">{title}</div>
      </div>

      <div className="drawer-content">{children}</div>
      <button className="drawer-toggle" onClick={handleCancelChanges}>
        {isOpen ? "Cancel" : "Open Drawer"}
      </button>
      <div className=" ml-10 drawer-button">
        <Button
          styles={{ width: "150px" }}
          title="Add Budget"
          click={handleDrawerButton}
          platform={platFormType}
        />
      </div>
    </div>
  );
};

export default Drawer;
