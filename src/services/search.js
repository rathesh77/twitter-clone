import { axiosInstance } from "../axios"

export const fetchSearch = async (value) => {
  try {
    const results = await axiosInstance.get(`/search?value=${value}`)
    if (results.status === 200) {

      const { data } = results

      return data
    }
    return false
  } catch (e) {
    return false

  }
} 
