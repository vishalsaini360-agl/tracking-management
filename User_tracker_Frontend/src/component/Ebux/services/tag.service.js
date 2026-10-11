import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";





export const getAllTag= async () => {

  try {
    const payload = {}
    // const response = await _POST(`${BASE_URL}ebux/client-customize-columns-comprehensive-breakdown`, payload, {
    //   'Content-Type': 'application/json'
    // });
    
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/tag/get-all-tags?clientId=${clientId}`, payload, 
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
export const saveTag= async (tag={}) => {

  try {
    const payload = {tag};
    
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/tag/save-tag?clientId=${clientId}`, payload, 
    
    {
      headers: {
        idtoken:id_token
      },
    }
  );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};
export const editTag= async (tag={}) => {

  try {
    const payload = {tag};
    
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/tag/edit-tag?clientId=${clientId}`, payload, 
    
    {
      headers: {
        idtoken:id_token
      },
    }
  );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const deleteSelectedTag = async (tags) => {
    try {
        
        const payload = {tags}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/tag/delete-tag?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}

export const saveTagMapWithSkuOrKeywords= async (tagIds=[],skuOrKeywords=[]) => {

  try {
    const payload = {tagIds,skuOrKeywords};
    
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/tag/save-tag-map?clientId=${clientId}`, payload,     
      {
        headers: {
          idtoken:id_token
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};
export const getWebPidTagImageAndName= async (web_pids=[]) => {

  try {
    const payload = {web_pids};
    
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/tag/get-web-pid-tag-name-image?clientId=${clientId}`, payload,     
      {
        headers: {
          idtoken:id_token
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};
export const deleteSelectedTagMaping = async (tag_id,tag_mapings) => {
    try {
        
        const payload = {tag_id,tag_mapings}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/tag/delete-tag-maping?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}

export const bulkUploadTags = async (rows, tag_type) => {
    try {

        const payload = {
            rows,
            tag_type
        };

        const clientId = localStorage.getItem("client_id");

        const response = await _POST(
            `${BASE_URL}ebux/tag/bulk-upload-tags?clientId=${clientId}`,
            payload,
            {
                "Content-Type": "application/json"
            }
        );

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
};