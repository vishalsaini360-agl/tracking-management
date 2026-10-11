import React from "react";

const Loader = ({ isLoading = false }) => {
  return (
    <>
      {isLoading && (
        <div className="loader">
          <img src="/assets/images/loader-web.gif" />
        </div>
      )}
    </>
  );
};
export default Loader;
