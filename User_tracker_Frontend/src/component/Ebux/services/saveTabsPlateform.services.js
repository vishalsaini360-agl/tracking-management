import { _POST,_GETWIthToken } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const saveTabsPlateform = async (tabsPalteformData) => {
    try {
        const payload = tabsPalteformData

      // const response = await _POST(`${BASE_URL}auth/save-plateform`, payload, {
      //   'Content-Type': 'application/json'
      // });
      let clientId = localStorage.getItem("client_id");
      const response = await _POST(`${BASE_URL}auth/save-plateform?clientId=${clientId}`, payload, {
        'Content-Type': 'application/json'
      });
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  };

  export const getTabsPlateform = async (tabsPalteformData) => {
    try {
        const payload = tabsPalteformData

        
      // const response = await _GET(`${BASE_URL}auth/get-plateform`, payload, {
      //   'Content-Type': 'application/json'
      // });

      const response = await _GETWIthToken(`${BASE_URL}auth/get-plateform`, payload, {
        'Content-Type': 'application/json'
      });
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  };

  // 

  export const saveOSAPlateform = async (tabsPalteformData) => {
    try {
        const payload = tabsPalteformData
        let routeParam;
        if(tabsPalteformData['type']=='osa_plateform'){
          routeParam='save-osa-plateform'
        }else if(tabsPalteformData['type']=='org_plateform'){
          routeParam='save-org-plateform'
        }else if(tabsPalteformData['type']=='cs_plateform'){
          routeParam='save-sc-plateform'
        }else if(tabsPalteformData['type']=='pro_plateform'){
          routeParam='save-pro-plateform'
        }else if(tabsPalteformData['type']=='rr_plateform'){
          routeParam='save-rr-plateform'
        }else if(tabsPalteformData['type']=='sod_plateform'){
          routeParam='save-sod-plateform'
        }else if(tabsPalteformData['type']=='som_plateform'){
          routeParam='save-som-plateform'
        }
        else{
          routeParam='save-sos-plateform'
        }

      // const response = await _POST(`${BASE_URL}auth/${routeParam}`, payload, {
      //   'Content-Type': 'application/json'
      // });

      let id_token= localStorage.getItem("id_token");
       let clientId = localStorage.getItem("client_id");
      const response = await _POST(`${BASE_URL}auth/${routeParam}?clientId=${clientId}`, payload, 
      //   {
      //   'Content-Type': 'application/json'
      // }
      {
        headers: {
          idtoken:id_token
        },
      }
    );
    
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  };