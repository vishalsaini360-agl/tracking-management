import MediaManagement from "./icons/MediaManagement";
import Business from "./icons/Business";
import DigitalShelf from "./icons/DigitalShelf";
import ProductInfo from "./icons/ProductInfo";

export const navList = [
  {
    id: 2,
    title: "Media Automation Management",
    icon: MediaManagement,
    baseUrl: "https://ebuxautomation.com/",
    lock: false,
    lockUrl: "mam",
    // disable: true,
  },
  {
    id: 1,
    title: "Digital Shelf Management",
    icon: DigitalShelf,
    lock: false,
    baseUrl: "https://ebuxautomation.com/",
    lockUrl: "dsm",
    // disable: true,
  },
  {
    id: 3,
    title: "Product Information Management",
    icon: ProductInfo,
    baseUrl: "https://ebuxautomation.com/",
    lock: false,
    lockUrl: "pim",
    // disable: true,
  },
  {
    id: 4,
    title: "Business Monitoring",
    icon: Business,
    baseUrl: "https://ebuxautomation.com/",
    lock: false,
    lockUrl: "",
    // disable: true,
  },
];

export const productList = [
  {
    id: 3,
    appName: "Product Information Management",
    url: "https://qa-pim.e-genie.ai/login",
    logo: "dummy.png",
    projectDescription:
      "Master Portal for Product Information Across E-Commerce Platforms",
    rolesAssocated: {
      roles: [
        {
          id: "4",
          name: "manager",
        },
        {
          id: "7",
          name: "kam",
        },
      ],
    },
    sort: 1,
    permission: false,
  },
  {
    id: 1,
    appName: "Digital Shelf Management",
    url: "https://qa-ds.e-genie.ai/login",
    logo: "DigitalShelfManagement.png",
    projectDescription:
      "Analyze Product Visibility on E-Commerce Platforms with Advanced Digital Shelf Analytics",
    rolesAssocated: {
      roles: [
        {
          id: "3",
          name: "user",
        },
      ],
    },
    sort: 2,
    permission: false,
  },
  {
    id: 2,
    appName: "Media Automation Management",
    url: "http://qa-ma.e-genie.ai:3000/login",
    logo: "E-Genie.png",
    projectDescription:
      "Central Hub to Manage Ads Across E-Commerce Platforms with Real-Time Data",
    rolesAssocated: {
      roles: [
        {
          id: "4",
          name: "manager",
        },
        {
          id: "5",
          name: "analyst",
        },
      ],
    },
    sort: 3,
    permission: true,
  },
  {
    id: 4,
    appName: "Business Monitoring",
    url: "https://qa-bm.e-genie.ai/login",
    logo: "BusinessMonitoring.png",
    projectDescription:
      "Central Dashboard to access your off-take data with insights from digital shelf.",
    rolesAssocated: {
      roles: [
        {
          id: "3",
          name: "user",
        },
      ],
    },
    sort: 4,
    permission: false,
  },
];

export const dashboardObj = {
  id: "dashboard",
  name: "Dashboard",
  value: "/dashboard",
  urlKeys: ["dashboard", "tagManager", "groupAccount"],
  icon: "/assets/images/dashboard.webp",
  color: "#047BD6",
};

export const noonObj = {
  id: "noon",
  name: "Noon",
  value: "/noon",
  icon: "/assets/images/noon.webp",
  color: "#FFCC02",
};

// Sample platform data - replace with actual data from props
export const defaultPlatforms = [
  dashboardObj,
];