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

export const getMessages = async (receiverId) => {
  try {
    const res = await axios.get(`${serverUrl}/api/user/get/${receiverId}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Fetch messages failed' }
  }
}

export const sendMessage = async (receiverId, payload) => {
  try {
    // payload: either { message } or FormData with 'image' and 'message'
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }

    const res = await axios.post(`${serverUrl}/api/user/send/${receiverId}`, payload, config)
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Send failed' }
  }
}

export const updateProfile = async (dispatch, payload) => {
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) {
      config.headers = { "Content-Type": "application/json" }
    }
    const res = await axios.put(`${serverUrl}/api/user/profile`, payload, config)
    dispatch(setUserData(res.data.user));
    return res.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Update failed",
    };
  }
};

export const deleteProfileImage = async (url) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/user/profile/image`, {
      data: { url },
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
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

export const deleteItem = async (id) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/item/${id}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const updateItem = async (id, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    const res = await axios.put(`${serverUrl}/api/item/${id}`, payload, config)
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Update failed' }
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

export const deleteMarketplaceItem = async (id) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/marketplace/${id}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const updateMarketplaceItem = async (id, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    const res = await axios.put(`${serverUrl}/api/marketplace/${id}`, payload, config)
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Update failed' }
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