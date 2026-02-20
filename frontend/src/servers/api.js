import axios from "axios"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice";
import { setItems } from "../redux/itemSlice";
import { setClaims, setMyClaims } from "../redux/claimSlice";


export const getCurrentuser =async(dispatch)=>{
    try {
        const res =await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
    
        dispatch(setUserData(res.data.user))
        
    } catch (error) {
        console.log(error);
        
    }

}

export const generateNotes = async (payload) => {
  try {
    const { data } = await axios.post(
      `${serverUrl}/api/notes/generate-notes`,
      payload,
      { withCredentials: true }
    );
    console.log(data);
    
    return data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Generate failed"
    };
  }
};


export const fetchItems = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/getAll`, {
      withCredentials: true,
    })
    dispatch(setItems(res.data.items || []))
  } catch (err) {
    console.error("Fetch items failed", err)
  }
}

export const fetchClaimRequests = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claimed-request`, {
      withCredentials: true,
    })
    dispatch(setClaims(res.data?.claims || []))
  } catch (err) {
    console.error("Fetch claim requests failed", err)
  }
}

export const fetchMyClaims = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claim/my`, {
      withCredentials: true,
    })
    dispatch(setMyClaims(res.data?.claims || []))
  } catch (err) {
    console.error("Fetch my claims failed", err)
  }
}

export const fetchMarketplaceItems = async (dispatch, filters = {}) => {
  try {
    const params = new URLSearchParams()
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category)
    }
    if (filters.search) {
      params.append("search", filters.search)
    }
    if (filters.status) {
      params.append("status", filters.status)
    }

    const res = await axios.get(`${serverUrl}/api/marketplace?${params.toString()}`, {
      withCredentials: true,
    })
    
    const { setMarketplaceItems } = await import("../redux/marketplaceSlice")
    dispatch(setMarketplaceItems(res.data.items || []))
    return res.data
  } catch (err) {
    console.error("Fetch marketplace items failed", err)
    return { items: [] }
  }
}

export const fetchMarketplaceItemById = async (id) => {
  try {
    const res = await axios.get(`${serverUrl}/api/marketplace/${id}`, {
      withCredentials: true,
    })
    return res.data
  } catch (err) {
    console.error("Fetch marketplace item failed", err)
    throw err
  }
}