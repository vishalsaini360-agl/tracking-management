// const duplicate = (
//   <svg
//     width="12"
//     height="13"
//     viewBox="0 0 11 12"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g clipPath="url(#clip0_2_39593)">
//       <path
//         d="M9.16667 4.625H5.04167C4.53541 4.625 4.125 5.03541 4.125 5.54167V9.66667C4.125 10.1729 4.53541 10.5833 5.04167 10.5833H9.16667C9.67293 10.5833 10.0833 10.1729 10.0833 9.66667V5.54167C10.0833 5.03541 9.67293 4.625 9.16667 4.625Z"
//         stroke="black"
//         strokeOpacity="0.85"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M2.29297 7.37508H1.83464C1.59152 7.37508 1.35836 7.2785 1.18645 7.1066C1.01455 6.93469 0.917969 6.70153 0.917969 6.45841V2.33341C0.917969 2.0903 1.01455 1.85714 1.18645 1.68523C1.35836 1.51333 1.59152 1.41675 1.83464 1.41675H5.95964C6.20275 1.41675 6.43591 1.51333 6.60782 1.68523C6.77972 1.85714 6.8763 2.0903 6.8763 2.33341V2.79175"
//         stroke="black"
//         strokeOpacity="0.85"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </g>
//     {/* <defs>
//       <clipPath id="clip0_2_39593">
//         <rect
//           width="11"
//           height="11"
//           fill="white"
//           transform="translate(0 0.5)"
//         />
//       </clipPath>
//     </defs> */}
//   </svg>
// );

export const pin = (
  <svg
    width="17"
    height="15"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5 15.5833V20.1666"
      stroke="black"
      strokeOpacity="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.08203 15.5833H17.9154V13.9699C17.9152 13.6288 17.8199 13.2946 17.6401 13.0047C17.4604 12.7148 17.2033 12.4809 16.8979 12.3291L15.2662 11.5041C14.9608 11.3523 14.7037 11.1183 14.524 10.8285C14.3442 10.5386 14.2489 10.2043 14.2487 9.86325V5.49992H15.1654C15.6516 5.49992 16.1179 5.30676 16.4617 4.96295C16.8055 4.61913 16.9987 4.15282 16.9987 3.66659C16.9987 3.18036 16.8055 2.71404 16.4617 2.37022C16.1179 2.02641 15.6516 1.83325 15.1654 1.83325H7.83203C7.3458 1.83325 6.87949 2.02641 6.53567 2.37022C6.19185 2.71404 5.9987 3.18036 5.9987 3.66659C5.9987 4.15282 6.19185 4.61913 6.53567 4.96295C6.87949 5.30676 7.3458 5.49992 7.83203 5.49992H8.7487V9.86325C8.74852 10.2043 8.65319 10.5386 8.47344 10.8285C8.29369 11.1183 8.03664 11.3523 7.7312 11.5041L6.09953 12.3291C5.79409 12.4809 5.53704 12.7148 5.35729 13.0047C5.17754 13.2946 5.08221 13.6288 5.08203 13.9699V15.5833Z"
      stroke="black"
      strokeOpacity="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// const history = (
//   <svg
//     width="12"
//     height="12"
//     viewBox="0 0 12 12"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g clipPath="url(#clip0_2_39601)">
//       <path
//         d="M10.6052 7.94504C10.2871 8.69728 9.78959 9.36015 9.15614 9.87569C8.52269 10.3912 7.77259 10.7438 6.97142 10.9024C6.17025 11.0611 5.34241 11.0211 4.56027 10.7859C3.77814 10.5508 3.06551 10.1276 2.48471 9.55337C1.90391 8.97916 1.47261 8.27142 1.22852 7.49201C0.98443 6.71261 0.934982 5.88528 1.0845 5.08236C1.23402 4.27943 1.57795 3.52535 2.08622 2.88605C2.5945 2.24675 3.25164 1.7417 4.0002 1.41504"
//         stroke="black"
//         strokeOpacity="0.85"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M11 6C11 5.34339 10.8707 4.69321 10.6194 4.08658C10.3681 3.47995 9.99983 2.92876 9.53553 2.46447C9.07124 2.00017 8.52005 1.63188 7.91342 1.3806C7.30679 1.12933 6.65661 1 6 1V6H11Z"
//         stroke="black"
//         strokeOpacity="0.85"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </g>
//     {/* <defs>
//       <clipPath id="clip0_2_39601">
//         <rect width="12" height="12" fill="white" />
//       </clipPath>
//     </defs> */}
//   </svg>
// );

const PinMenu = ({
  // handleDuplicate = false,
  handlePin = false,
  // handleHistory = false,
  hidePin = false,
}) => {
  return (
    <div className="flex cursor-pointer gap-2">
      {/* <img className="w-4 mr-1" src="/assets/images/duplicate1.svg" /> */}
      {/* <div
        className="flex items-center"
        onClick={() => handleDuplicate && handleDuplicate()}
      >
        <div className="mr-[2px]">{duplicate}</div>
        <p className="text-xs mr-1">Duplicate</p>
      </div> */}

      {!hidePin && (
        <div
          className="flex items-center"
          onClick={() => handlePin && handlePin()}
        >
          {/* <img className="w-4" src="/assets/images/pin.svg" /> */}
          {pin}
          <p className="text-xs mr-1">Pin</p>
        </div>
      )}

      {/* <img className="w-4 mr-1 " src="/assets/images/pie-chart.svg" /> */}
      {/* <div
        className="flex items-center"
        onClick={() => handleHistory && handleHistory()}
      >
        <div className="mr-[3px]">{history}</div>
        <p className="text-xs ">History</p>
      </div> */}
    </div>
  );
};

export default PinMenu;
