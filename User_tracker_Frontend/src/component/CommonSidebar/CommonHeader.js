import egenie from "./icons/egenie.svg";

const CommonHeader = () => {
  return (
    <div className="h-12 bg-white w-full flex items-center gap-2 pl-6">
      <img src={egenie} width={22} height={22} />
        <div className="text-[18px] leading-[22px] text-[#333333">e-Genie Suite</div>
    </div>
  );
};

export default CommonHeader;
