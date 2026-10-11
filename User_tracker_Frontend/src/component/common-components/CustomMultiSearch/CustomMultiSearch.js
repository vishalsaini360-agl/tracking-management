/* eslint-disable no-console */
import React from "react";
import { TreeSelect } from "primereact/treeselect";
import { cloneDeep } from "lodash";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./style.css";
import SearchPopUp from "./searchPopUp";
import {
  flipkartSearchFilter,
  blinkitSearchFilter,
  BlinkitMetric,
  flipkartMetric,
  BlinkItMatchMetric,
  // AMAZON
  // amazonSearchFilter,
  customamazonSearchFilter,
  amazonNameIdFilterReport,
  amazonMetric,
  amazonMatchMetric,
  amazonCampaignTypeReport,
  zeptoSearchFilter,
  zeptoNameIdFilterReport,
  zeptoMetric,
  zeptoMatchMetric,
  zeptoCampaignTypeReport,
  // catalogSearchFilters,
  // catalogNameIdFilter,
  blinkitCampaignTypeReport,
  blinkitNameIdFilterReport,
  instamartSearchFilter,
  instamartNameIdReportFilter,
  instamartMetric,
  instamartMatchMetric,
} from "./searchData";
import { connect } from "react-redux";
class CustomMultiSearch extends React.Component {
  constructor(props) {
    super(props);
    let searchFilter;
    switch (this.props.platform) {
      case "blinkit":
        searchFilter = cloneDeep(blinkitSearchFilter);
        break;
      case "flipkart":
        searchFilter = cloneDeep(flipkartSearchFilter);
        break;
      case "amazon":
        searchFilter = cloneDeep(customamazonSearchFilter);
        break;
      case "zepto":
        searchFilter = cloneDeep(zeptoSearchFilter);
        break;
      case "instamart":
        searchFilter = cloneDeep(instamartSearchFilter);
        break;
      // case "catalog":
      //   searchFilter = catalogSearchFilters;
      //   break;
      default:
        searchFilter = cloneDeep(flipkartSearchFilter);
        break;
    }
    // console.log("debugerrr 222>>>", searchFilter);
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
      disableSave: false,
      initialset: true,
    };

    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    // this.treeSelectRef = React.createRef(null);
    // this.onFilterSelected = this.onFilterSelected.bind(this);
  }

  // componentDidMount() {
  //   const tree = document.querySelectorAll(".p-placeholder");
  //   console.log("tre>>>>>>>>", tree);
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.clearSearch !== this.props.clearSearch) {
      this.clearFilters();
      this.props.setClearSearch();
      this.setState({ disabled: false, disableSave: false });
      this.setState({
        selectedNodeKeys: [],
      });
    }

    if (
      this.props.edit == true &&
      this.props.prefilledfilters &&
      Object.keys(this.props.prefilledfilters).length > 0
    ) {
      if (
        JSON.stringify(this.state.selectedNodeKeys) !==
        JSON.stringify(this.props.prefilledfilters)
      ) {
        if (this.state.initialset) {
          this.setState({
            selectedNodeKeys: this.props.prefilledfilters,
            initialset: false,
          });
        }
      }
    }

    if (prevState.selectedNodeKeys !== this.state.selectedNodeKeys) {
      this.props.storeSearchFilter(this?.state?.selectedNodeKeys);
    }
  }

  getSearchOptions() {
    let searchMetrics;
    let nameId = {
      key: "name_id",
      label: "Name/ID",
      selectable: false,
      children: [
        {
          key: "name_id-campaign_name",
          label: "Campaign Name",
          data: "Name/ID - Campaign Name",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-ad_group_name",
          label: "Ad Group Name",
          data: "Name/ID - Ad Group Name",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-product_name",
          label: "FSN Name",
          data: "Name/ID - FSN Name",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-keyword",
          label: "Keyword",
          data: "Name/ID - Keyword",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-campaign_id",
          label: "Campaign ID",
          data: "Name/ID - Campaign ID",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-ad_group_id",
          label: "Ad Group ID",
          data: "Name/ID - Ad Group ID",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-fsn_id",
          label: "FSN ID",
          data: "Name/ID - FSN ID",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-tag_name",
          label: "Tag Name",
          data: "Name/ID - TAG",
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };
    let metricsOptions = {
      spends: { label: "Spends", key: "spend" },
      views: { label: "Views", key: "views" },
      clicks: { label: "Clicks", key: "clicks" },
      ctr: { label: "CTR", key: "ctr" },
      cpc: { label: "CPC", key: "cpc" },
      // units_sold: { label: "Units Sold", key: "units_sold" },
      units_sold: { label: "Orders", key: "units_sold" },
      // revenue: { label: "Revenue", key: "revenue" },
      revenue: { label: "Sales", key: "revenue" },
      cvr: { label: "CVR", key: "cvr" },
      roi: { label: "ROAS", key: "roi" },
      aov: { label: "AOV", key: "aov" },
    };
    let segmentSection = {
      key: "segment",
      label: "Campaign Type",
      selectable: false,
      children: [
        {
          label: "PLA",
          key: "segment-PLA",
          data: "Campaign Type - PLA",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "PCA",
          key: "segment-PCA",
          data: "Campaign Type - PCA",
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };

    let platformSection = {
      key: "platform",
      label: "Platform",
      selectable: false,
      children: [
        {
          label: "Flipkart",
          key: "platform-MP",
          data: "Platform - Flipkart",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Supermart",
          key: "platform-SM",
          data: "Platform - Supermart",
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };

    let budgetSection = {
      key: "campaign_budget_type",
      label: "Campaign Budget Type",
      selectable: false,
      children: [
        {
          label: "Daily Budget",
          key: "campaign_budget_type-DAILY_BUDGET",
          data: "Campaign budget type - Daily budget",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Total Budget",
          key: "campaign_budget_type-TOTAL_BUDGET",
          data: "Campaign budget type - Total budget",
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };

    let campaignStatusSection = {
      key: "campaign_status",
      label: "Campaign Status",
      selectable: false,
      children: [
        {
          label: "Live",
          key: "campaign_status-LIVE",
          data: "Campaign Status - Live",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Completed",
          key: "campaign_status-COMPLETED",
          data: "Campaign Status - Completed",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Paused",
          key: "campaign_status-PAUSED",
          data: "Campaign Status - Paused",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Total Budget Met",
          key: "campaign_status-TOTAL_BUDGET_MET",
          data: "Campaign Status - Total budget met",
          className: this.state?.disabled ? "disableli" : "",
        },

        {
          label: "Aborted",
          key: "campaign_status-ABORTED",
          data: "Campaign Status - Aborted",
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };
    let extraFilter = [
      segmentSection,
      platformSection,
      campaignStatusSection,
      budgetSection,
    ];

    switch (this.props.platform) {
      case "blinkit":
        nameId = blinkitNameIdFilterReport;
        searchMetrics = BlinkitMetric;
        metricsOptions = BlinkItMatchMetric;
        extraFilter = [blinkitCampaignTypeReport];
        break;
      case "flipkart":
        searchMetrics = flipkartMetric;
        break;
      case "amazon":
        nameId = amazonNameIdFilterReport;
        searchMetrics = amazonMetric;
        metricsOptions = amazonMatchMetric;
        extraFilter = [amazonCampaignTypeReport];

        break;

      case "zepto":
        nameId = zeptoNameIdFilterReport;
        searchMetrics = zeptoMetric;
        metricsOptions = zeptoMatchMetric;
        extraFilter = [zeptoCampaignTypeReport];
        break;

      case "instamart":
        nameId = instamartNameIdReportFilter;
        searchMetrics = instamartMetric;
        metricsOptions = instamartMatchMetric;
        extraFilter = [];
        break;
      // case "catalog":
      //   nameId = catalogNameIdFilter;
      //   searchMetrics = [];
      //   metricsOptions = [];
      //   extraFilter = [];
      //   break;
      default:
        searchMetrics = flipkartMetric;
        break;
    }
    let metrics = searchMetrics;

    let treeOption = [];

    Object.keys(metrics).map((key) => {
      let row = { ...metrics[key] };
      let childern = [];
      Object.keys(metricsOptions).map((val) => {
        if (this.props.platform === "flipkart") {
          let set = {
            label: metricsOptions[val].label,
            key: metrics[key].key + "-" + metricsOptions[val].key,
            data: `${row.label} - ${metricsOptions[val].label}`,
            className: this.state?.disabled ? "disableli" : "",
          };
          childern.push(set);
        } else if (
          this.props.platform === "amazon" ||
          this.props.platform === "zepto" ||
          this.props.platform === "blinkit" ||
          this.props.platform === "instamart"
        ) {
          if (metricsOptions[val].isAvailable.includes(row.tab)) {
            let set = {
              label: metricsOptions[val].label,
              key: metrics[key].key + "-" + metricsOptions[val].key,
              data: `${row.label} - ${metricsOptions[val].label}`,
            };
            childern.push(set);
          }
        }
      });

      row.children = childern;

      treeOption.push(row);
    });

    let saveSearchData = this.props.saveSearch;
    let temp = saveSearchData.children?.map((item) => ({
      ...item,
      className:
        // eslint-disable-next-line no-unsafe-optional-chaining
        (this.state?.disabled && !(item.key in this.state?.selectedNodeKeys)) ||
        this.state?.disableSave
          ? "disableli"
          : "",
    }));
    saveSearchData.children = temp;
    return [saveSearchData, nameId, ...extraFilter, ...treeOption];
    // : [nameId, ...extraFilter, ...treeOption];
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
      // console.log("debugerrr onNodeSelected 4 metriccc");

      searchType = "metric";
    }
    if (splitKey[0] !== "saved_search") {
      this.setState({
        searchType: searchType,
        showPopUp: true,
        popUpData: e.node,
        displaySearch: !this.state.displaySearch,
        disableSave: true,
      });
    } else {
      if (splitKey[0] === "saved_search") {
        this.setState({ disabled: true });
        //   let savedSearch={pkey:splitKey[0],key:e.node.key,value:e.node.data,condition:""};
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
      if (Object.keys(selectedNodeKeys).length == 1) {
        this.setState({ disableSave: false });
      }
      this.setState({ selectedNodeKeys, searchFilter }, () => {
        this.props.applySearchFilter(
          searchFilter,
          splitKey[0] === "name_id" ? splitKey[1] : splitKey[0]
        );
      });

      if (splitKey[0] === "saved_search") {
        this.clearFilters();
      }
      let clearFilters = true;
      Object.keys(selectedNodeKeys).forEach(function (key) {
        if (selectedNodeKeys[key].checked) {
          clearFilters = false;
        }
      });
      if (clearFilters) {
        this.clearFilters();

        this.props.setClearSearch();
        this.setState({ disabled: false, disableSave: false });
      }
      if (this.props.edit == true) {
        this.props.storeSearchFilter(this?.state?.selectedNodeKeys);
      }
    }
  };

  onPopUpClose = (key) => {
    this.onNodeRemoved(key);
  };

  clearFilters = () => {
    switch (this.props.platform) {
      case "flipkart":
        this.setState({
          searchFilter: {
            // saved_search: [],
            name_id: [],
            campaign_m: [],
            keyword_m: [],
            ad_group_m: [],
            fsn_m: [],
            creative_m: [],
            placement_m: [],
            segment: [],
            platform: [],
            campaign_status: [],
            campaign_budget_type: [],
            // amazon_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              // saved_search: [],
              name_id: [],
              campaign_m: [],
              keyword_m: [],
              ad_group_m: [],
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
        //filters = flipkartSearchFilter;
        break;
      case "blinkit":
        this.setState({
          searchFilter: {
            name_id: [],
            campaign_m: [],
            category_m: [],
            keyword_m: [],

            blinkit_campaign_type: [],
          },
        });
        this.props.applySearchFilter(
          {
            searchFilter: {
              // saved_search: [],
              name_id: [],
              campaign_m: [],
              category_m: [],
              keyword_m: [],

              blinkit_campaign_type: [],
            },
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;
      case "amazon":
        this.setState({
          searchFilter: {
            // saved_search: [],
            name_id: [],
            portfolio_m: [],
            campaign_m: [],
            keyword_m: [],
            ad_group_m: [],
            asin_m: [],
            fsn_m: [],
            creative_m: [],
            search_term_m: [],
            placement_m: [],
            segment: [],
            platform: [],
            campaign_status: [],
            campaign_budget_type: [],
            amazon_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              // saved_search: [],
              name_id: [],
              portfolio_m: [],
              campaign_m: [],
              keyword_m: [],
              ad_group_m: [],
              asin_m: [],
              fsn_m: [],
              creative_m: [],
              search_term_m: [],
              placement_m: [],
              segment: [],
              platform: [],
              campaign_status: [],
              campaign_budget_type: [],
            },
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;
      case "zepto":
        this.setState({
          searchFilter: {
            // saved_search: [],
            name_id: [],
            campaign_m: [],
            category_m: [],
            keyword_m: [],
            product_m: [],
            zepto_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              name_id: [],
              campaign_m: [],
              category_m: [],
              keyword_m: [],
              product_m: [],
              zepto_campaign_type: [],
            },
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;

      case "instamart":
        this.setState({
          searchFilter: {
            // saved_search: [],
            name_id: [],
            campaign_m: [],
            keyword_m: [],
            ad_group_m: [],
            product_m: [],
            fsn_m: [],
            creative_m: [],
            placement_m: [],
            segment: [],
            platform: [],
            campaign_status: [],
            campaign_budget_type: [],
            product_name: [],
            campaign_id: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              // saved_search: [],
              name_id: [],
              campaign_m: [],
              keyword_m: [],
              ad_group_m: [],
              fsn_m: [],
              product_m: [],
              creative_m: [],
              placement_m: [],
              segment: [],
              platform: [],
              campaign_status: [],
              campaign_budget_type: [],
              product_name: [],
              campaign_id: [],
            },
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;
      default:
        this.setState({
          searchFilter: {
            // saved_search: [],
            name_id: [],
            campaign_m: [],
            keyword_m: [],
            ad_group_m: [],
            fsn_m: [],
            creative_m: [],
            search_term_m: [],
            placement_m: [],
            segment: [],
            platform: [],
            campaign_status: [],
            campaign_budget_type: [],
            blinkit_campaign_type: [],
            amazon_campaign_type: [],
            zepto_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              // saved_search: [],
              name_id: [],
              campaign_m: [],
              keyword_m: [],
              ad_group_m: [],
              fsn_m: [],
              creative_m: [],
              search_term_m: [],
              placement_m: [],
              segment: [],
              platform: [],
              campaign_status: [],
              campaign_budget_type: [],
            },
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;
    }
  };

  setShowPopUp = () => {
    this.setState({
      showPopUp: !this.state.showPopUp,
      displaySearch: !this.state.displaySearch,
      // displaySearch: false,
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
    e = e.filter((val) => val.key !== key);
    this.onNodeRemoved(key);
    this.searchLabel(e);
  };

  searchLabel = (e) => {
    // eslint-disable-next-line no-console
    // console.log("debugerrr 2", e);
    // e = [
    //   {
    //     key: "name_id-portfolio",
    //     label: "Portfolio Name",
    //     data: "Name/ID - Portfolio",
    //   },
    // ];
    // console.log("E>>>>>>>>>>>>>>>>>>>>>>>", e);
    return e.map((val) => {
      {
        if (!val.children) {
          var label = val?.data;
          let keys = val?.key.split("-");
          if (keys[0] === "saved_search") {
            label = "Saved Search " + val?.label;
          }
        }
      }
      // eslint-disable-next-line no-console
      // console.log("debugerrr 3", val);

      return (
        <>
          {label !== undefined && (
            <div
              className="treeselect-input__tags-element  hidden"
              onClick={(event) => {
                event.stopPropagation();
                this.removeItemUsingClick(e, val.key);
              }}
            >
              <>
                <span className="treeselect-input__tags-name">{label}</span>
                <span className="treeselect-input__tags-cross">
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
              </>
            </div>
          )}
        </>
      );
    });
  };

  render() {
    let { selectedNodeKeys, showPopUp, popUpData, displaySearch } = this.state;
    let { platform } = this.props;
    return (
      <>
        <div
          className="card flex justify-content-center"
          id="tets"
          style={{
            // width: platform === "blinkit" ? "100%" : "90%",
            width: "90%",
            maxWidth: "90%",
          }}
        >
          <TreeSelect
            value={selectedNodeKeys}
            onNodeUnselect={(e) => {
              this.onNodeRemoved(e.node.key, e.node);
            }}
            onChange={(e) => {
              this.setState({
                selectedNodeKeys: e.value,
              });
            }}
            style={{ height: "3rem" }}
            inputId="treeSelect"
            options={this.getSearchOptions()}
            metaKeySelection={false}
            className=" custom-tree w-full"
            selectionMode="checkbox"
            display="chip"
            onNodeSelect={(e) => {
              this.onNodeSelected(e);
            }}
            panelStyle={
              displaySearch ? { display: "flow" } : { display: "none" }
            }
            valueTemplate={(e) => {
              //
              // console.log("e>>>>>>>>>>>>>>>>>>>>>>>>", e);
              if (e.length > 0) {
                let treeselectLabelElements =
                  document.querySelectorAll(".p-placeholder");
                treeselectLabelElements.forEach((element) => {
                  Object.assign(element.style, { padding: "0.35rem 0.75rem" });
                });
                return this.searchLabel(e);
              } else {
                const nodes = document.querySelectorAll(
                  `.p-treeselect-label-empty`
                );
                nodes.forEach((node) => {
                  node.classList.remove("p-treeselect-label-empty");
                });

                let treeselectLabelElements =
                  document.querySelectorAll(".p-placeholder");
                treeselectLabelElements.forEach((element) => {
                  Object.assign(element.style, { padding: "0.75rem 0.75rem" });
                });
                return (
                  <>
                    <span className="fa fa-search form-control-feedback"></span>
                    <span className="ml-5">Search</span>
                  </>
                );
              }
            }}
            tabIndex={-1}
          />
        </div>

        {showPopUp ? (
          <SearchPopUp
            popUpData={popUpData}
            showPopUp={true}
            setShowPopUp={this.setShowPopUp}
            setSearchFilter={this.setSearchFilter}
            searchType={this.state.searchType}
            onPopUpClose={this.onPopUpClose}
            selectedFilter={this.state.selectedFilter}
            platform={platform}
            color={this.props.color}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(CustomMultiSearch);

// export default CustomMultiSearch;
