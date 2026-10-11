import React from "react";
const NewPagination = ({ newpaginate }) => {
  return (
    <div className="flex justify-center">
      <button onClick={() => newpaginate()}>load more</button>
    </div>
  );
};

export default NewPagination;
