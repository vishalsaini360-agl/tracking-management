import React, { useState, useEffect } from "react";
import "./StarCheckbox.css";

const StarCheckbox = ({ isChecked, onToggle, order, product, disabled }) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);
  useEffect(() => {
    setChecked(isChecked);
  }, [order]);
  const handleChange = (e) => {
    e.stopPropagation(); // Stop the event from bubbling up
    if (!disabled) {
      // Only allow change if not disabled
      const newCheckedStatus = !checked;
      setChecked(newCheckedStatus);
      onToggle(newCheckedStatus);
    }
  };

  return (
    <div
      className={`star-checkbox ${disabled ? "star-checkbox disabled" : ""}`}
    >
      <input
        type="checkbox"
        id={`star-checkbox-${product.value}`} // unique id
        checked={checked}
        onChange={handleChange}
        disabled={disabled} // Disable input when `disabled` is true
      />
      <label
        htmlFor={`star-checkbox-${product.value}`}
        className={checked ? "checked" : ""}
        onClick={(e) => e.stopPropagation()} // Stop label click event from bubbling
      >
        {checked && order}
      </label>
    </div>
  );
};

// export default StarCheckbox;
export default React.memo(StarCheckbox);
