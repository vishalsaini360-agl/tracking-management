import React from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { LIMIT } from "../../utils/constants";
const Pagination = ({ paginate, page, totalData }) => {
  return (
    <div className="flex justify-end">
      <button onClick={() => paginate("prev")} disabled={page == 1}>
        <KeyboardArrowLeftIcon
          style={{ color: page === 1 ? "#80808085" : "black" }}
        />
      </button>

      <span>
        {page}/{Math.ceil(totalData / LIMIT)}
      </span>

      <button
        onClick={() => paginate("next")}
        disabled={page === Math.ceil(totalData / LIMIT)}
      >
        <KeyboardArrowRightIcon
          style={{
            color:
              page === Math.ceil(totalData / LIMIT) ? "#80808085" : "black",
          }}
        />
      </button>
    </div>
  );
};

export default Pagination;
