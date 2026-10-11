import React from "react";
import { buttonThemeObj } from "../../../style/StyleConstants";

const Button = ({
  title,
  click,
  blinkit,
  type,
  disable,
  styles,
  hoverText,
  instamart,
  platform = "flipkart",
}) => {
  return (
    <>
      <button
        disabled={disable}
        style={styles}
        className={[
          "  flipkart__applybtn",
          blinkit && "blinkit__btn",
          instamart && "instamart__btn",
          buttonThemeObj[platform],
        ].join(" ")}
        onClick={click}
        type={type}
      >
        {hoverText && <span className="hover-text">{hoverText}</span>}
        {title}
      </button>
    </>
  );
};
export default Button;
