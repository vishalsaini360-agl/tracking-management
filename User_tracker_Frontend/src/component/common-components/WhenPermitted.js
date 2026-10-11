import { useSelector } from "react-redux";
import _ from "lodash";
const WhenPermitted = ({ platform, permission, children }) => {
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
 
  const hasPermission = _.find(userPermissions, {
    permission_name: permission,
    platform,
  });

  return hasPermission ? children : null;
};
export default WhenPermitted;
