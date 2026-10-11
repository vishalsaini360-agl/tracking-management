import React,
 { useEffect
  // ,useState 
} 
 from "react";
// import { _GET } from "../../../services/axios.method";
// import { USER_DETAILS } from "../../../utils/constants";

const Profile = () => {
  // const [userDetail, setUserDetail] = useState({});

  const full_name = localStorage.getItem("full_name");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  // const userDetailsApi = async () => {
  //   try {
  //     const result = await _GET(USER_DETAILS);

  //     setUserDetail(result?.data?.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    // userDetailsApi();
  }, []);
  return (
    <>
      <div className="flex pt-4">
        <div className="w-1/3  ml-8 ">
          <img
            className="rounded-full w-[150px] h-[150px]"
            src="/assets/images/profile-picture.jpg"
            alt=""
          ></img>
        </div>
        <div className="mt-10">
          <div className="mb-2">
            <span className="mr-1 font-bold ">Name:</span>
            <span>{full_name}</span>
          </div>
          <div className="mb-2">
            <span className="mr-1 font-bold">Username:</span>
            <span>{name}</span>
          </div>
          <div className="mb-2">
            <span className="mr-1 font-bold">Email:</span>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
