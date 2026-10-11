import React from "react";

// useState returns a pair. 'count' is the current state. 'setCount' is a function we can use to update the state.

const IncrementDecrementBtn = ({ count, setCount }) => {
  // const [count, setCount] = useState(0);
  const increment = () => {
    //setCount(prevCount => prevCount+=1);
    setCount(function (prevCount) {
      if (prevCount < 100) {
        return (prevCount += 10);
      } else {
        return (prevCount = 100);
      }
    });
  };
  const decrement = () => {
    setCount(function (prevCount) {
      if (prevCount > 0) {
        return (prevCount -= 10);
      } else {
        return (prevCount = 0);
      }
    });
  };
  return (
    <>
      <div className="quantity  row incredecrebtn">
        <button onClick={decrement} className="quantity__minus">
          <span className="pr-1">-</span>
        </button>
        <h2 className="col text-center pt-1 bg-white border-r border-l">
          {count} %
        </h2>
        <button onClick={increment} className="quantity__plus">
          <span className="pl-2">+</span>
        </button>
      </div>
    </>
  );
};

export default IncrementDecrementBtn;
