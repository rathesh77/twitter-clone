import { axiosInstance } from "../axios"

export const fetchMe = async () => {
  try {
    const response = await axiosInstance.get('/me')
    if (response.status === 200) {

      const { data } = response
      return data
    }
    return false
  } catch (e) {
    return false

  }
}

export const fetchUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user?id=${userId}`)
    if (response.status === 200) {
      return response.data
    }
    return false
  } catch (e) {
    return false

  }
}

export const login = async (data) => {
  try {
    const response = await axiosInstance.post('/login', {
      ...data
    })
    if (response.status === 200) {
      return response.data
    }
    return false
  } catch (e) {
    return false

  }
}

export const logout = async () => {
  try {
    await axiosInstance.delete('/logout')

  } catch (e) {
    return false

  }
}

export const followUser = async (userId) => {
  try {
    await axiosInstance.put(`/follow/${userId}`)
    return true
  } catch (e) {
    return false

  }
}

export const fetchSuggestions = async (userId) => {
  try {
    const suggestions = await axiosInstance.get('/suggestions')
    return suggestions.data
  } catch (e) {
    return false

  }
}

export const fetchFollowers = async (userId) => {
  try {
    let followers = await axiosInstance.get(`/followers?id=${userId}`)
    return followers.data.count
  } catch (e) {
    return false

  }
}

export const fetchFollowings = async (userId) => {
  try {
    let followings = await axiosInstance.get(`/followings?id=${userId}`)
    return followings.data.count
  } catch (e) {
    return false

  }
}

export const doesCurrentUserFollowRecipient = async (userId) => {
  try {
    const following = await axiosInstance.get(`/follow/${userId}`)
    return following.data
  } catch (e) {
    return false

  }
} 