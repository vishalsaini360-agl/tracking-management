import React from "react";
import { TreeSelect } from "primereact/treeselect";
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
  amazonSearchFilter,
  amazonNameIdFilter,
  amazonMetric,
  amazonMatchMetric,
  amazonCampaignType,
  zeptoSearchFilter,
  zeptoNameIdFilter,
  zeptoMetric,
  zeptoMatchMetric,
  zeptoCampaignType,
  catalogSearchFilters,
  catalogNameIdFilter,
  blinkitCampaignType,
  blinkitNameIdFilter,
  instamartSearchFilter,
  instamartNameIdFilter,
  instamartMetric,
  instamartMatchMetric,
  mathSign,
  notAllowedList,
} from "./searchData";
import { connect } from "react-redux";
import { listColorObj, themeColorObj } from "./constant";
 
class MultiSearch extends React.Component {
  constructor(props) {
    super(props);
    let searchFilter;
    switch (this.props.mediaName) {
      case "blinkit":
        searchFilter = blinkitSearchFilter;
        break;
      case "flipkart":
        searchFilter = flipkartSearchFilter;
        break;
      case "amazon":
        searchFilter = amazonSearchFilter;
        break;
      case "zepto":
        searchFilter = zeptoSearchFilter;
        break;
      case "instamart":
        searchFilter = instamartSearchFilter;
        break;
      case "catalog":
        searchFilter = catalogSearchFilters;
        break;
      default:
        searchFilter = flipkartSearchFilter;
        break;
    }
    this.state = {
      nodes: this.getSearchOptions(),
      selectedNodeKeys: null,
      showPopUp: false,
      popUpData: { heading: "", key: "", value: "" },
      searchFilter: searchFilter,
      selectedNames: {
        campaign_name: "",
        ad_group_name: "",
        fsn_name: "",
        keyword: "",
        campaign_id: "",
        ad_group_id: "",
        fsn_id: "",
        tag_name: "",
        placement: "",
        category_name: "",
        product_name: "",
      },

      displaySearch: true,
      searchType: "search",
      defaultLabels: [],
      selectedFilter: null,
      disabled: false,
      disableSave: false,
    };

    this.onNodeSelected = this.onNodeSelected.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    // this.treeSelectRef = React.createRef(null);
    // this.onFilterSelected = this.onFilterSelected.bind(this);
  }

  // handleClick = (evt) => {
  //   let targetEl = evt.target;
  //   let element = document.querySelector("#treeSelect");
  //   const treeClassArray = [
  //     "p-treeselect",
  //     "p-treeselect-label-container",
  //     "p-treeselect-label",
  //     "p-treeselect-trigger",
  //     "p-treeselect-panel",
  //     "p-treeselect-items-wrapper",
  //     "p-treenode-label",
  //     "p-treenode-content",
  //     "p-checkbox-box",
  //     "forTreeSelect",
  //     "p-hidden-accessible",
  //     "p-checkbox",
  //     "p-icon",
  //     "p-treenode",
  //     "treeselect-input__tags-cross",
  //   ];
  //   if (targetEl.className && typeof targetEl.className === "string") {
  //     const includesClass = treeClassArray.includes(
  //       targetEl.className.split(" ")[0]
  //     );

  //     if (includesClass) {
  //       if (
  //         this.state.showPopUp &&
  //         ![
  //           "campaign_budget_type",
  //           "campaign_status",
  //           "platform",
  //           "segment",
  //         ].includes(this.state.searchType)
  //       ) {
  //         element.click();
  //         this.setState({ displaySearch: false });
  //       } else {
  //         this.setState({ displaySearch: true });
  //         if ("forTreeSelect" === targetEl.className.split(" ")[0])
  //           element.click();
  //       }
  //     } else if (
  //       targetEl?.className === "treeselect-input__tags-cross" ||
  //       targetEl?.className === "treeselect-input__tags-name"
  //     ) {
  //       element.click();
  //     } else {
  //       let isOpen = document.querySelector(".p-treeselect-panel");
  //       if (isOpen?.style.display === "flow") {
  //         element.click();
  //         element.blur();
  //       }
  //       this.setState({ displaySearch: false });
  //     }
  //   }
  //   // else {
  //   //   let classCheck = targetEl.getAttribute("class");
  //   //   let svgElement = targetEl?.parentElement?.className;
  //   //   if (
  //   //     this.state.displaySearch &&
  //   //     !classCheck &&
  //   //     !treeClassArray.includes(classCheck?.split(" ")[0])
  //   //   ) {
  //   //     let isOpen = document.querySelector(".p-treeselect-panel");
  //   //     if (isOpen?.style.display === "flow") {
  //   //       element.click();
  //   //       element.blur();
  //   //       this.setState({ displaySearch: false });
  //   //     }
  //   //   } else if (
  //   //     treeClassArray.includes(svgElement) ||
  //   //     targetEl?.className === "treeselect-input__tags-cross" ||
  //   //     targetEl?.className === "treeselect-input__tags-name"
  //   //   ) {
  //   //     element.click();
  //   //   }
  //   // }
  // };

  componentDidMount() {
    this.injectDynamicStyles();
  }

  injectDynamicStyles = () => {
    const platform = this.props.mediaName;
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

  componentDidUpdate(prevProps) {
    if (prevProps.clearSearch !== this.props.clearSearch) {
      this.clearFilters();
      this.props.setClearSearch();
      this.setState({ disabled: false, disableSave: false });
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
          mapKey: "campaign_name",
          label: "Campaign Name",
          data: `Campaign Name - `,
          //   ${this?.state?.selectedNames?.campaign_name?.length > 0
          //     ? this?.state?.selectedNames?.campaign_name?.join(", ")
          //     : "Name/ID"
          // }
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-ad_group_name",
          mapKey: "ad_group_name",
          label: "Ad Group Name",
          data: `Ad Group Name - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-fsn_name",
          mapKey: "fsn_name",
          label: "FSN Name",
          data: `FSN Name - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-keyword",
          mapKey: "keyword",
          label: "Keyword",
          data: `Keyword - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-campaign_id",
          mapKey: "campaign_id",
          label: "Campaign ID",
          data: ` Campaign ID - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-ad_group_id",
          mapKey: "ad_group_id",
          label: "Ad Group ID",
          data: `Ad Group ID - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-fsn_id",
          mapKey: "fsn_id",
          label: "FSN ID",
          data: `FSN ID - `,
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          key: "name_id-tag_name",
          mapKey: "tag_name",
          label: "Tag Name",
          data: `TAG - `,
          className: this.state?.disabled ? "disableli" : "",
        },
      ],
    };
    let metricsOptions = {
      spends: { label: "Spends", key: "spend" },
      views: { label: "Views", key: "views" },
      clicks: { label: "Click", key: "clicks" },
      ctr: { label: "CTR", key: "ctr" },
      cpc: { label: "CPC", key: "cpc" },
      units_sold: { label: "Units Sold", key: "units_sold" },
      revenue: { label: "Revenue", key: "revenue" },
      cvr: { label: "CVR", key: "cvr" },
      roi: { label: "ROAS", key: "roi" },
      aov: { label: "AOV", key: "aov" },
    };

    let metricsDeafultOptions = {
      spends: { label: "Spends", key: "spend" },
      views: { label: "Views", key: "views" },
      clicks: { label: "Click", key: "clicks" },
      ctr: { label: "CTR", key: "ctr" },
      cpc: { label: "CPC", key: "cpc" },
      units_sold: { label: "Units Sold", key: "units_sold" },
      revenue: { label: "Revenue", key: "revenue" },
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

    let campaignStatusSectionAms = {
      key: "campaign_status",
      label: "Campaign Status",
      selectable: false,
      children: [
        {
          label: "Active",
          key: "campaign_status-ENABLED",
          data: "Campaign Status - Active",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Archived",
          key: "campaign_status-ARCHIVED",
          data: "Campaign Status - Archived",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Paused",
          key: "campaign_status-PAUSED",
          data: "Campaign Status - Paused",
          className: this.state?.disabled ? "disableli" : "",
        }
      ],
    };

    let campaignStatusBlinkit = {
      key: "campaign_status",
      label: "Campaign Status",
      selectable: false,
      children: [
        {
          label: "Active",
          key: "campaign_status-ACTIVE",
          data: "Campaign Status - Active",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Stopped",
          key: "campaign_status-STOPPED",
          data: "Campaign Status - Stopped",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Completed",
          key: "campaign_status-COMPLETED",
          data: "Campaign Status - Completed",
          className: this.state?.disabled ? "disableli" : "",
        }
      ],
    };

    let campaignStatusInstamart = {
      key: "campaign_status",
      label: "Campaign Status",
      selectable: false,
      children: [
        {
          label: "Active",
          key: "campaign_status-CAMPAIGN_STATUS_LIVE",
          data: "Campaign Status - Active",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Stopped",
          key: "campaign_status-CAMPAIGN_STATUS_STOPPED",
          data: "Campaign Status - Stopped",
          className: this.state?.disabled ? "disableli" : "",
        }
        
      ],
    };

    let campaignStatusZepto = {
      key: "campaign_status",
      label: "Campaign Status",
      selectable: false,
      children: [
        {
          label: "Active",
          key: "campaign_status-ACTIVE",
          data: "Campaign Status - Active",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Paused",
          key: "campaign_status-PAUSED",
          data: "Campaign Status - Paused",
          className: this.state?.disabled ? "disableli" : "",
        },
        {
          label: "Draft",
          key: "campaign_status-DRAFT",
          data: "Campaign Status - Draft",
          className: this.state?.disabled ? "disableli" : "",
        }
      ],
    };

  

    


    let extraFilter = [
      segmentSection,
      platformSection,
      campaignStatusSection,
      budgetSection,
    ];

    switch (this.props.mediaName) {
      case "blinkit":
        nameId = blinkitNameIdFilter;
        // nameId = this.attachStateToData(blinkitNameIdFilter);
        searchMetrics = BlinkitMetric;
        metricsOptions = BlinkItMatchMetric;
        extraFilter = [blinkitCampaignType,campaignStatusBlinkit];
        break;
      case "flipkart":
        searchMetrics = flipkartMetric;
        break;
      case "amazon":
        nameId = amazonNameIdFilter;
        // nameId = this.attachStateToData(amazonNameIdFilter);
        searchMetrics = amazonMetric;
        metricsOptions = amazonMatchMetric;
        extraFilter = [amazonCampaignType,campaignStatusSectionAms];
        break;

      case "zepto":
        nameId = zeptoNameIdFilter;
        // nameId = this.attachStateToData(zeptoNameIdFilter);
        searchMetrics = zeptoMetric;
        metricsOptions = zeptoMatchMetric;
        extraFilter = [zeptoCampaignType,campaignStatusZepto];
        break;

      case "instamart":
        nameId = instamartNameIdFilter;
        // nameId = this.attachStateToData(instamartNameIdFilter);
        searchMetrics = instamartMetric;
        metricsOptions = instamartMatchMetric;
        extraFilter = [campaignStatusInstamart];
        break;
      case "catalog":
        nameId = catalogNameIdFilter;
        searchMetrics = [];
        metricsOptions = [];
        extraFilter = [];
        break;
      default:
        searchMetrics = flipkartMetric;
        break;
    }
    let metrics = searchMetrics;

    let treeOption = [];

    Object.keys(metrics).map((key) => {
      let row = { ...metrics[key] };
      let childern = [];
      if (this.props.mediaName === "flipkart") {
        if (
          this.props.mediaName === "flipkart" &&
          row.label == "Campaign Metric"
        ) {
          metricsOptions = {
            budget: {
              label: "Budget",
              key: "flipkart_supermart_campaign.campaign_budget",
            },
            ...metricsOptions,
          };
        } else {
          metricsOptions = metricsDeafultOptions;
        }
      }
      Object.keys(metricsOptions).map((val) => {
        if (this.props.mediaName === "flipkart") {
          let set = {
            label: metricsOptions[val].label,
            key: metrics[key].key + "-" + metricsOptions[val].key,
            data: `${row.label} - ${metricsOptions[val].label}`,
            className: this.state?.disabled ? "disableli" : "",
          };
          childern.push(set);
        } else if (
          this.props.mediaName === "amazon" ||
          this.props.mediaName === "zepto" ||
          this.props.mediaName === "blinkit" ||
          this.props.mediaName === "instamart"
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

    // else if (this.props.mediaName === "amazon") {
    //   Object.keys(metrics).map((key) => {
    //     let row = { ...metrics[key] };
    //     let childern = [];
    //     Object.keys(metricsOptions).map((val) => {

    //     });
    //     row.children = childern;
    //     treeOption.push(row);
    //   });
    // }

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

    return this.props.mediaName !== "catalog"
      ? [saveSearchData, nameId, ...extraFilter, ...treeOption]
      : [nameId, ...extraFilter, ...treeOption];


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
      // console.log("<<< inside main");
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

  // onFilterSelected = (filter) => {
  //   this.setState({ selectedFilter: filter });
  // };

  onNodeRemoved = (key) => {
    this.setState({ disabled: false });
    let selectedNodeKeys = this.state.selectedNodeKeys;

    let splitKey = key.split("-");

    // console.log(
    //   "key>>",
    //   key,
    //   "selectedNodeKeys>>",
    //   selectedNodeKeys,
    //   "split keys>>",
    //   splitKey
    // );
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
      // console.log(searchFilter, selectedNodeKeys, "selected node");
    }

    //console.log(this.state.selectedNodeKeys,"selectedNodeKeys",key);
    // if(selectedNodeKeys.hasOwnProperty("saved_search")){
    //     this.setState({selectedNodeKeys:null,searchFilter: {"saved_search":[],"name_id":[],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]},},()=>{
    //         console.log(this.state.selectedNodeKeys,"selectedNodeKeys",key);
    //     });
    // }
  };

  onPopUpClose = (key) => {
    this.onNodeRemoved(key);
  };

  clearFilters = () => {
    switch (this.props.mediaName) {
      // case "blinkit":
      // this.setState({
      //   searchFilter: {
      //     saved_search: [],
      //     name_id: [],
      //     campaign_m: [],
      //     keyword_m: [],
      //     category_m: [],
      //     location_m: [],
      //     product_m: [],
      //   },
      //   selectedNodeKeys: null,
      // });
      // //console.log(this.searchFilter, "aaaaaaaaaaa");
      // this.props.applySearchFilter(
      //   {
      //     searchFilter: {
      //       saved_search: [],
      //       name_id: [],
      //       campaign_m: [],
      //       keyword_m: [],
      //       category_m: [],
      //       location_m: [],
      //       product_m: [],
      //     },
      //   },
      //   "clear"
      // );
      // //filters = blinkitSearchFilter;
      // break;
      case "flipkart":
        this.setState({
          searchFilter: {
            saved_search: [],
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
            amazon_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              saved_search: [],
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
        //console.log(this.searchFilter, "aaaaaaaaaaa");
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
        //filters = flipkartSearchFilter;
        break;
      case "amazon":
        this.setState({
          searchFilter: {
            saved_search: [],
            name_id: [],
            portfolio_m: [],
            campaign_m: [],
            keyword_m: [],
            ad_group_m: [],
            asin_m: [],
            fsn_m: [],
            creative_m: [],
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
              saved_search: [],
              name_id: [],
              campaign_m: [],
              portfolio_m: [],
              keyword_m: [],
              ad_group_m: [],
              fsn_m: [],
              asin_m: [],
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
      case "zepto":
        this.setState({
          searchFilter: {
            saved_search: [],
            name_id: [],
            campaign_m: [],
            keyword_m: [],
            product_m: [],
            ad_group_m: [],
            fsn_m: [],
            creative_m: [],
            placement_m: [],
            segment: [],
            platform: [],
            campaign_status: [],
            campaign_budget_type: [],
            zepto_campaign_type: [],
          },
          selectedNodeKeys: null,
        });
        //console.log(this.searchFilter, "aaaaaaaaaaa");
        this.props.applySearchFilter(
          {
            searchFilter: {
              saved_search: [],
              name_id: [],
              campaign_m: [],
              keyword_m: [],
              product_m: [],
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

      case "instamart":
        this.setState({
          searchFilter: {
            saved_search: [],
            name_id: [],
            campaign_m: [],
            keyword_m: [],
            product_m: [],
            ad_group_m: [],
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
              saved_search: [],
              name_id: [],
              campaign_m: [],
              keyword_m: [],
              product_m: [],
              ad_group_m: [],
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
          },
          "clear"
        );
        //filters = flipkartSearchFilter;
        break;
      default:
        this.setState({
          searchFilter: {
            saved_search: [],
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
              saved_search: [],
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
    }
    // this.setState({
    //   searchFilter: filters,
    //   selectedNodeKeys: null,
    // });
    // console.log(this.searchFilter, "aaaaaaaaaaa");
    // this.props.applySearchFilter(
    //   {
    //     searchFilter: filters,
    //   },
    //   "clear"
    // );
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
        
        obj.forEach((item) => filters[item.pkey].push(item));

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
    //this.searchLabel(this.state.selectedNodeKeys.hasOwnProperty("saved_search") ? []:e);
    this.searchLabel(e);
    // if (key.split("-")?.[0] === "amazon_campaign_type") {
    //   this.props.dispatch({
    //     type: ActionType.CAMPAIGN_TYPE,
    //     payload: "amazon_campaign_type",
    //   });
    // }
  };

  searchLabel = (e) => {
    // eslint-disable-next-line no-console
    // console.log(e, "event");

    return e.map((val, index) => {
      let mapObj = { value: "", sign: "" }; // For expression filters like spends > 10, click between 10-20
      let nameObj = { contains: [], not_contains: [] }; // Only for Name:Id filters

      let keyArr = val?.key?.split("-"); // 'name_id-keyword' --> ['name_id', 'keyword']

      //For Name:Id filters only stores contains and not contains values
      if (val?.mapKey && !notAllowedList[keyArr[0]]) {
        // mapKey is additonal key which is available only on Name:Id obj
        this?.state?.searchFilter[keyArr[0]]?.forEach((obj) => {
          if (obj?.pkey === keyArr[0] && obj?.key === keyArr[1]) {
            nameObj[obj?.condition] = obj?.value;
          }
        });
      }

      // For expression filters only like greater, between
      if (!val?.mapKey && !notAllowedList[keyArr[0]]) {
        this?.state?.searchFilter[keyArr[0]]?.forEach((obj) => {
          if (obj?.pkey === keyArr[0] && obj?.key === keyArr[1]) {
            mapObj.value = obj?.value;
            mapObj.sign = mathSign[obj?.condition];
          }
        });
      }
      // eslint-disable-next-line no-console
      // console.log(val, "neww", this.state.searchFilter, keyArr);

      {
        if (!val.children) {
          var labelType = [];
          var label = val?.data;

          let keys = val?.key.split("-");
          if (keys[0] === "saved_search") {
            label = "Saved Search - " + val?.label;
            labelType[0] = "Saved Search";
            labelType[1] = val?.label;
          } else {
            labelType = val?.data?.split("-");
            // eslint-disable-next-line no-console
            console.warn(labelType);
          }
        }
      }

      return (
        <>
          {label !== undefined && (
            <div
              key={index}
              className="treeselect-input__tags-element group !p-0 !pr-1 flex items-center !bg-white border border-[#D6D6D7] hover:!bg-[#f1dada]  hover:border-[#DD4242] hover:text-[#DD4242] font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                this.removeItemUsingClick(e, val.key);
              }}
            >
              <>
                <div className="py-1 pr-1">
                  <span className=" pl-2 pr-1">{`${
                    labelType[0] ? labelType[0] : label
                  }`}</span>
                </div>

                {labelType[1]?.length > 1 && (
                  <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                    <span className="my-1 ml-1 rounded-sm font-semibold px-2 bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                      {`${labelType[1]}`}
                    </span>
                  </div>
                )}

                {val?.mapKey ? (
                  <>
                    {nameObj?.contains?.length > 0 && (
                      <>
                        <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                          <span className="my-1 ml-1 px-1 font-normal">
                            contains
                          </span>
                        </div>
                        <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                          <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                            {nameObj?.contains
                              ?.map((el) => {
                                if (Array.isArray(el)) {
                                  return "(" + el.join(" & ") + ")";
                                }
                                return el;
                              })
                              .join(" || ")}
                          </span>
                        </div>
                      </>
                    )}
                    {nameObj?.not_contains?.length > 0 && (
                      <>
                        <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                          <span className="my-1 ml-1 px-1 font-normal">
                            not contains
                          </span>
                        </div>
                        <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                          <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                            {nameObj?.not_contains
                              ?.map((el) => {
                                if (Array.isArray(el)) {
                                  return "(" + el.join(" & ") + ")";
                                }
                                return el;
                              })
                              .join(" || ")}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {mapObj?.sign && (
                      <div className="p-1 border-l group-hover:border-l-[#DD4242] flex items-center">
                        {mapObj?.sign === "between" ||
                        mapObj?.sign === "isn't between" ? (
                          <span className="font-normal">{mapObj?.sign}</span>
                        ) : (
                          <span className="px-1 border rounded-sm">
                            {mapObj?.sign}
                          </span>
                        )}
                      </div>
                    )}
                    {mapObj?.value && (
                      <div className="p-1 border-l group-hover:border-l-[#DD4242]">
                        <span className="my-1 ml-1 rounded-sm px-2 bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
                          {mapObj?.value}
                        </span>
                      </div>
                    )}
                  </>
                )}
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
          className={`card flex justify-content-center ${this.props.mediaName}`}
          style={{
            width: this.props.mediaName == "catalog" ? "100%" : "90%",
            // width: "90%",
          }}
        >
          <TreeSelect
            // placeholder={"HELO"}
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
            className=" w-full"
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
            platform={this.props.mediaName}
            handleSelectedNames={this.handleSelectedNames}
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

export default connect(null, mapDispatchToProps)(MultiSearch);

// export default MultiSearch;
