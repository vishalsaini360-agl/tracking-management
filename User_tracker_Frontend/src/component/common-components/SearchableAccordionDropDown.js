/* eslint-disable react/no-children-prop */
const Accordion = ({ title, children }) => {
  return (
    <>
      <div>
        <p>{title}</p>
        <div>
          {children.map((v) => {
            return (
              <>
                <label className="row px-2">
                  <input type="checkbox" />
                  <p className="px-2">{v}</p>
                </label>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

const SearchableAccordionDropDown = () => {
  const accordiuonData = [
    {
      title: "Saved Search",
      children: ["Search 1"],
    },
    {
      title: "Name/ID",
      children: ["Campaign Name", "Ad Group Name", "FSN Name"],
    },
  ];
  return (
    <>
      <div className="SearchableAccordionDropDown relative border border-black">
        <div className="SearchableAccordionDropDown__input relative">
          <input placeholder="Search..." className="w-full p-2 outline-none" />
          <button className="absolute right-2 top-1/4  border rounded-full px-1">
            X
          </button>
        </div>
        <div className="absolute top-full left-0 w-full p-2 bg-white border border-black">
          {accordiuonData.map((v) => {
            return (
              <>
                <Accordion title={v.title} children={v.children} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchableAccordionDropDown;
