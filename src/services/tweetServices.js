import { axiosInstance } from "../axios"

export const findTweetById = async (tweetId) => {
  try {
    const results = await axiosInstance.get('/tweet/'+tweetId)
    return results.data
  } catch (e) {
    return false

  }
}
export const findLikedTweetsByUser = async (userId) => {
  try {
    const results = await axiosInstance.get('/liked-tweets/'+userId)
    return results.data
  } catch (e) {
    return false

  }
}

export const postTweet = async (data) => {
  try {
    const results = await axiosInstance.post('/tweet',
      {
        data
      }
    )
    return results.data
  } catch (e) {
    return false

  }
}


export const fetchRelatedTweets = async (userId) => {
  try {
    const results = await axiosInstance.get(
      `/my-related-tweets?userId=${userId}`,
      {
        data: {
          userId
        }
      }
    )
    return results.data
  } catch (e) {
    return false

  }
}

export const fetchTweetsUnderTweet = async (tweetId) => {
  try {
    let results = await axiosInstance.get(`/tweet/${tweetId}/messages`)
    return results.data
  } catch (e) {
    return false

  }
}


export const fetchDeepTweets = async (userId) => {
  try {
    const results = await axiosInstance.get(`/deep-tweets?userId=${userId}`)
    return results.data
  } catch (e) {
    return false

  }
}

export const postRetweet = async (tweetId) => {
  try {
    const results = await axiosInstance.post(`/retweet/${tweetId}`)

    return results.data
  } catch (e) {
    return false

  }
}

export const postLikeTweet = async (tweetId) => {
  try {
    const results = await axiosInstance.post(`/likeTweet/${tweetId}`)

    return results.data
  } catch (e) {
    return false

  }
}

export const postDislikeTweet = async (tweetId) => {
  try {
    const results = await axiosInstance.post(`/dislikeTweet/${tweetId}`)

    return results.data
  } catch (e) {
    return false

  }
}

export const postMedia = async (file) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  const formData = new FormData();
  formData.append('file', file)
  try {
    const response = await axiosInstance.post('/media', formData, config);

    return response.data
  } catch (e) {
    return false

  }
}

