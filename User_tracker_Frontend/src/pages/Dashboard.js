import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { APPLICATION_ROUTES } from "../utils/constants";

const Dashboard = () => {
  const history = useHistory();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      history.push(APPLICATION_ROUTES.COMMONSCREEN);
    } else {
      history.push(APPLICATION_ROUTES.TOKEN_LOGIN);
    }
  }, [history]);

  return null;
};

export default Dashboard;
