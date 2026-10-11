import React from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./style.css";
import KeywordSearchPopUp from "./KeywordSearchPopUp";

class KeywordMultiSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.getSearchOptions(),
      selectedNodeKeys: null,
      showPopUp: false,
      popUpData: { heading: "", key: "", value: "" },
      searchFilter: { name_id: [] },
      displaySearch: true,
      searchType: "search",
      defaultLabels: [],
    };
    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
  }

  getSearchOptions() {
    if (this.props.page === "blinkit") {
      return [
        {
          key: "name_id",
          label: "Name",
          selectable: false,
          children: [
            {
              key: "name_id-keyword",
              label: "Keyword",
              data: "Keyword",
            },
            {
              key: "name_id-campaign_name",
              label: "Campaign Name",
              data: "Name - Campaign Name",
            },
          ],
        },
      ];
    } else if (this.props.page === "keyword") {
      return [
        {
          key: "name_id",
          label: "Name",
          selectable: false,
          children: [
            {
              key: "name_id-keyword",
              label: "Keyword",
              data: "Keyword",
            },
            {
              key: "name_id-campaign_name",
              label: "Campaign Name",
              data: "Name - Campaign Name",
            },
            {
              key: "name_id-ad_group_name",
              label: "Ad Group Name",
              data: "Name - Ad Group Name",
            },
          ],
        },
      ];
    } else {
      return [
        {
          key: "name_id",
          label: "Name",
          selectable: false,
          children: [
            {
              key: "name_id-search_term",
              label: "Search Term",
              data: "Name- Search Term",
            },
            {
              key: "name_id-campaign_name",
              label: "Campaign Name",
              data: "Name - Campaign Name",
            },
            {
              key: "name_id-ad_group_name",
              label: "Ad Group Name",
              data: "Name - Ad Group Name",
            },
          ],
        },
      ];
    }
  }

  onNodeSelected = (e) => {
    let searchType = "search";
    let splitKey = e.node.key.split("-");
    if (
      Object.prototype.hasOwnProperty.call(this.state.searchFilter, splitKey[0]) === true &&
      splitKey[0] !== "name_id"
    ) {
      searchType = "metric";
    }
    this.setState({
      searchType: searchType,
      showPopUp: true,
      popUpData: e.node,
      displaySearch: !this.state.displaySearch,
    });
  };
  onNodeRemoved = (key) => {
    // console.log(key,"node removed");
    let selectedNodeKeys = this.state.selectedNodeKeys;
    let splitKey = key.split("-");
    let searchFilter = this.state.searchFilter;
    if (Object.prototype.hasOwnProperty.call(selectedNodeKeys, key)) {
      // console.log(searchFilter);
      if (Object.prototype.hasOwnProperty.call(searchFilter, splitKey[0])) {
        searchFilter[splitKey[0]] = searchFilter[splitKey[0]].filter(
          (rm) => rm.key !== splitKey[1]
        );
      }
      // console.log(searchFilter);
      delete selectedNodeKeys[key];
      this.setState({ selectedNodeKeys, searchFilter }, () => {
        this.props.applySearchFilter(
          searchFilter,
          splitKey[0] === "name_id" ? splitKey[1] : splitKey[0]
        );
      });
    }
  };
  onPopUpClose = (key) => {
    this.onNodeRemoved(key);
  };

  setShowPopUp = () => {
    this.setState({
      showPopUp: !this.state.showPopUp,
      displaySearch: !this.state.displaySearch,
    });
  };
  setSearchFilter = (obj) => {
    if (Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj.pkey)) {
      let filters = this.state.searchFilter;
      filters[obj.pkey].push(obj);
      // filters[obj.pkey].push(obj);
      this.setState({ searchFilter: filters }, () => {
        // console.log(filters,"obj");
        this.props.applySearchFilter(
          filters,
          obj.pkey === "name_id" ? obj.key : obj.pkey
        );
      });
    }
  };

  removeItemUsingClick = (e, key) => {
    // console.log(key,"key data",this.state.selectedNodeKeys);
    e = e.filter((val) => val.key !== key);
    this.onNodeRemoved(key);
    //this.searchLabel(this.state.selectedNodeKeys.hasOwnProperty("saved_search") ? []:e);
    this.searchLabel(e);
  };

  searchLabel = (e) => {
    // console.log(e,"selectedObj");
    return e.map((val) => {
      {
        var label = val.data;
        let keys = val.key.split("-");
        if (keys[0] === "saved_search") {
          label = "Saved Search " + val.label;
        }
      }

      return (
        <>
          {label !== undefined && (
            <div
              className="treeselect-input__tags-element relative bottom-[2px]"
              onClick={() => {
                this.removeItemUsingClick(e, val.key);
              }}
            >
              <span className="treeselect-input__tags-name text-xs">{label}</span>
              <span className="treeselect-input__tags-cross text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 25 25"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </div>
          )}
        </>
      );
    });
  };

  render() {
    let {
      selectedNodeKeys,
      showPopUp,
      popUpData,
      displaySearch,
    } = this.state;
    return (
      <>
        <div className="card flex justify-content-center h-10 w-full">
          <TreeSelect
            value={selectedNodeKeys}
            onNodeUnselect={(e) => {
              this.onNodeRemoved(e.node.key);
            }}
            onChange={(e) => {
              this.setState({ selectedNodeKeys: e.value });
            }}
            options={this.getSearchOptions()}
            metaKeySelection={false}
            className="md:w-20rem w-full"
            selectionMode="checkbox"
            placeholder="Search"
            display="chip"
            onNodeSelect={(e) => this.onNodeSelected(e)}
            panelStyle={
              displaySearch ? { display: "flow" } : { display: "none" }
            }
            valueTemplate={(e) => {
              return this.searchLabel(e);
            }}
            tabIndex={-1}
          />
        </div>
        {showPopUp ? (
          <KeywordSearchPopUp
            popUpData={popUpData}
            showPopUp={true}
            setShowPopUp={this.setShowPopUp}
            setSearchFilter={this.setSearchFilter}
            searchType={this.state.searchType}
            onPopUpClose={this.onPopUpClose}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default KeywordMultiSearch;
