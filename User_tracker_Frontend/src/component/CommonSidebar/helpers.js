export const getLocalSidebarMenu = () => {
    return localStorage.getItem("sidebarOpenMenu");
  };
  
  export const setLocalSidebarMenu = (menu) => {
    localStorage.setItem("sidebarOpenMenu", JSON.stringify(menu));
  };