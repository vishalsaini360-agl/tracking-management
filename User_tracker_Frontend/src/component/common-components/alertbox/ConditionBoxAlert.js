import React from "react";

const ConditionBoxAlert=()=>{
    const handleClick = () => {
        alert('button click catched');
    };
    return(
        <>
           <div >
        <button onClick={handleClick}>Click me</button>
      </div>
        </>
    )
}
export default ConditionBoxAlert