import React from "react";
import { useHistory } from "react-router-dom";

const AccessDenied = () => {
  const history = useHistory();
  return (
    <div className="w-[100%] h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg max-w-md w-full text-center bg-white">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p>
          You do not have the necessary permissions to access the User
          Onboarding Module. This feature is restricted to Admin and Owner roles
          only. If you believe this is an error, please contact your system
          administrator.
        </p>
        {/* {buttonText && ( */}
        <button
          type="login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={() => history.push("/dashboard")}
        >
          Back To Dashboard
        </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default AccessDenied;
