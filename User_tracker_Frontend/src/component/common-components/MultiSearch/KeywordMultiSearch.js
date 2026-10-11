import React from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./style.css";
import SearchPopUp from "./searchPopUp";
import { format } from "date-fns";

import {
  defaultDateRange,
  // defaultCompareDateBlinkit,
} from "../../../utils/helpers";
import {
  amsNegKeyword,
  amsNegKeywordCampaignType,
  amsNegKeywordSearchFilter,
  amsSearchTerm,
  blinkitNegKeyword,
  blinkitNegKeywordSearchFilter,
  fkNegKeywordSearchFilter,
  flipkartKeyword,
  negKeywordFkCampaignType,
  searchTermAmsCampaignType,
  searchTermAmsMatchMetric,
  searchTermAmsMetric,
  searchTermAmsSearchFilter,
  searchTermFkCampaignType,
  searchTermFkMatchMetric,
  searchTermFkSearchFilter,
} from "./searchData";
import { listColorObj, themeColorObj } from "./constant";
class KeywordMultiSearch extends React.Component {
  constructor(props) {
    super(props);
    let searchFilter;
    switch (this.props.page) {
      case "ams_neg_keyword":
        searchFilter = amsNegKeyword;
        break;
      case "search_term":
      case "fk_search_term":
        searchFilter = amsSearchTerm;
        break;
      case "blinkit":
        searchFilter = blinkitNegKeyword;
        break;
      default:
      case "keyword":
        searchFilter = blinkitNegKeyword;
        searchFilter = amsNegKeyword;
        break;

      case "fk_keyword":
        searchFilter = flipkartKeyword;
        break;
      // case "fk_search_term":
      //   searchFilter = amsSearchTerm;
      //   break;
    }
    this.state = {
      nodes: this.getSearchOptions(),
      selectedNodeKeys: null,
      showPopUp: false,
      popUpData: { heading: "", key: "", value: "" },
      searchFilter: searchFilter,

      displaySearch: true,
      searchType: "search",
      defaultLabels: [],
      selectedFilter: null,
      disabled: false,
    };
    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
  }

  componentDidMount() {
    this.injectDynamicStyles();
  }

  injectDynamicStyles = () => {
    const platform =this.props.platform
    const platformColor = themeColorObj[platform] || "#0081f7";

    const css = `
        .p-dropdown-items > .p-dropdown-item:hover {
          background: ${platformColor} !important;
        }

        .p-checkbox .p-checkbox-box.p-highlight{
          border-color: ${platformColor} !important;
          background: ${platformColor} !important;
        }

        .p-checkbox .p-checkbox-box .p-checkbox-icon.p-icon {
          background:${platformColor} !important;
        }

        .p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight {
        background: ${listColorObj[platform]} !important;
        }
    `;
    const style = document.createElement("style");
    style.setAttribute("id", `${this.props.mediaName}-tree`);
    style.type = "text/css";
    style.textContent = css;
    document.head.appendChild(style);
  };

  componentWillUnmount() {
    const styleTag = document.getElementById(`${this.props.mediaName}-tree`);
    if (styleTag) {
      styleTag.remove();
    }
  }


  getSearchOptions() {
    let nameId;
    let extraFilter;
    let searchMetrics;
    let metricsOptions;
    switch (this.props.page) {
      case "ams_neg_keyword":
        nameId = amsNegKeywordSearchFilter;
        searchMetrics = [];
        metricsOptions = [];
        extraFilter = [amsNegKeywordCampaignType];
        break;
      case "search_term":
        nameId = searchTermAmsSearchFilter;
        searchMetrics = searchTermAmsMetric;
        metricsOptions = searchTermAmsMatchMetric;
        extraFilter = [searchTermAmsCampaignType];
        break;
      case "blinkit":
        nameId = blinkitNegKeywordSearchFilter;
        searchMetrics = [];
        metricsOptions = [];
        extraFilter = [];
        break;
      case "fk_keyword":
        nameId = fkNegKeywordSearchFilter;
        searchMetrics = [];
        metricsOptions = [];
        extraFilter = [negKeywordFkCampaignType];
        break;

      case "fk_search_term":
        nameId = searchTermFkSearchFilter;
        searchMetrics = searchTermAmsMetric;
        metricsOptions = searchTermFkMatchMetric;
        extraFilter = [searchTermFkCampaignType];
        break;

      default:
        searchMetrics = searchTermAmsMetric;
        break;
    }
    let metrics = searchMetrics;
    let treeOption = [];
    Object.keys(metrics).map((key) => {
      let row = { ...metrics[key] };
      let childern = [];
      Object.keys(metricsOptions).map((val) => {
        let set = {
          label: metricsOptions[val].label,
          key: metrics[key].key + "-" + metricsOptions[val].key,
          data: `${row.label} - ${metricsOptions[val].label}`,
        };
        childern.push(set);
      });

      row.children = childern;
      treeOption.push(row);
    });
    return [nameId, ...extraFilter, ...treeOption];
  }

  onNodeSelected = (e) => {
    let searchType = "search";
    let splitKey = e.node.key.split("-");
    if (
      [
        "segment",
        "platform",
        "campaign_status",
        "campaign_budget_type",
        "amazon_campaign_type",
        "zepto_campaign_type",
        "blinkit_campaign_type",
      ].indexOf(splitKey[0]) > -1
    ) {
      searchType = splitKey[0];
      this.setState({ selectedFilter: splitKey });
    } else if (
      Object.prototype.hasOwnProperty.call(
        this.state.searchFilter,
        splitKey[0]
      ) === true &&
      splitKey[0] !== "name_id"
    ) {
      searchType = "metric";
    }
    if (splitKey[0] !== "saved_search") {
      this.setState({
        searchType: searchType,
        showPopUp: true,
        popUpData: e.node,
        displaySearch: !this.state.displaySearch,
        // disableSave: true,
      });
    } else {
      if (splitKey[0] === "saved_search") {
        this.setState({ disabled: true });

        try {
          let search = JSON.parse(e.node.data);

          Object.keys(search).map((key) => {
            let item = search[key];

            Object.keys(item).map((name) => {
              if (item[name].length > 0) {
                let row = item[name];

                this.setSearchFilter(row);
              }
            });
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    // console.log(this.state, "<<<< state 2");
  };

  clearFilters = () => {
    this.state({
      searchFilter: {
        saved_search: [],
        name_id: [],
        campaign_m: [],
        keyword_m: [],
        // ad_group_m: [],
        fsn_m: [],
        creative_m: [],
        placement_m: [],
        segment: [],
        platform: [],
        campaign_status: [],
        campaign_budget_type: [],
        blinkit_campaign_type: [],
      },
      selectedNodeKeys: null,
    });
    this.props.applySearchFilter(
      {
        searchFilter: {
          saved_search: [],
          name_id: [],
          campaign_m: [],
          keyword_m: [],
          // ad_group_m: [],
          fsn_m: [],
          creative_m: [],
          placement_m: [],
          segment: [],
          platform: [],
          campaign_status: [],
          campaign_budget_type: [],
        },
      },
      "clear"
    );
  };

  onNodeRemoved = (key) => {
    this.setState({ disabled: false });
    let selectedNodeKeys = this.state.selectedNodeKeys;
    let splitKey = key.split("-");
    let searchFilter = this.state.searchFilter;
    if (Object.prototype.hasOwnProperty.call(selectedNodeKeys, key)) {
      if (Object.prototype.hasOwnProperty.call(searchFilter, splitKey[0])) {
        searchFilter[splitKey[0]] = searchFilter[splitKey[0]].filter(
          (rm) => rm.key !== splitKey[1]
        );
      }
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
    if (Array.isArray(obj)) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.state.searchFilter,
          obj[0].pkey
        )
      ) {
        let filters = this.state.searchFilter;
        filters[obj[0].pkey].push(obj[0]);
        filters[obj[0].pkey].push(obj[1]);

        this.setState({ searchFilter: filters }, () => {
          this.props.applySearchFilter(
            filters,
            obj[0].pkey === "name_id" ? obj[0].key : obj[0].pkey,
            obj[0],
            obj[1]
          );
        });
      }
    } else {
      if (
        Object.prototype.hasOwnProperty.call(this.state.searchFilter, obj.pkey)
      ) {
        let filters = this.state.searchFilter;
        filters[obj.pkey].push(obj);
        // filters[obj.pkey].push(obj);
        this.setState({ searchFilter: filters }, () => {
          this.props.applySearchFilter(
            filters,
            obj.pkey === "name_id" ? obj.key : obj.pkey
          );
        });
      }
    }
    // console.log(obj, "searchfilterinitial");
  };
  removeItemUsingClick = (e, key) => {
    // console.log(key,"key data",this.state.selectedNodeKeys);
    e = e.filter((val) => val.key !== key);
    this.onNodeRemoved(key);
    //this.searchLabel(this.state.selectedNodeKeys.hasOwnProperty("saved_search") ? []:e);
    this.searchLabel(e);
  };

  searchLabel = (e) => {
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
              <span className="treeselect-input__tags-name text-xs">
                {label}
              </span>
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

  onChangeDate(item) {
    let dateRange = this.state.dateRange[0];
    this.setState({ tempDate: [{ ...dateRange, ...item.selection }] });

    if (!this.state.calState.fullCalender) {
      let dateRange = this.state.dateRange[0];
      defaultDateRange(item.selection);
      this.setState(
        { dateRange: [{ ...dateRange, ...item.selection }] },
        () => {
          this.applyFilters(
            "start_date",
            format(this.state.dateRange[0].startDate, "yyyy-MM-dd")
          );
          this.applyFilters(
            "end_date",
            format(this.state.dateRange[0].endDate, "yyyy-MM-dd")
          );
        }
      );

      this.setState({
        calState: {
          ...this.state.calState,
          showCalender: false,
          dateApplied: true,
        },
      });
    }
  }
  handleSelectedNames = (obj) => {
    this.setState((prevState) => ({
      selectedNames: { ...prevState?.selectedNames, ...obj },
    }));
  };

  attachStateToData = (data) => {
    const newArr = data?.children?.map((obj) => {
      return {
        ...obj,
        data: `${obj?.label} ${
          this?.state?.selectedNames?.[obj?.mapKey]?.length > 0
            ? this?.state?.selectedNames?.[obj?.mapKey]?.join(", ")
            : "Name/Id"
        }`,
      };
    });
    const obj = {
      ...data,
      children: newArr,
    };
    return obj;
  };

  render() {
    let { selectedNodeKeys, showPopUp, popUpData, displaySearch } = this.state;
    return (
      <>
        <div
          className={`card flex justify-content-center h-10 w-full ${this.props.platform}`}
        >
          <TreeSelect
            value={selectedNodeKeys}
            onNodeUnselect={(e) => {
              this.onNodeRemoved(e.node.key);
            }}
            onChange={(e) => {
              this.setState({
                selectedNodeKeys: e.value,
              });
            }}
            inputId="treeSelect"
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
          <SearchPopUp
            popUpData={popUpData}
            showPopUp={true}
            setShowPopUp={this.setShowPopUp}
            // content
            setSearchFilter={this.setSearchFilter}
            searchType={this.state.searchType}
            onPopUpClose={this.onPopUpClose}
            selectedFilter={this.state.selectedFilter}
            handleSelectedNames={this.handleSelectedNames}
            platform={this.props.platform}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default KeywordMultiSearch;
