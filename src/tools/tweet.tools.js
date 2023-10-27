import { axiosInstance } from "../axios";
import { postMedia, postTweet } from "../services/tweetServices";

const BASE_URL = axiosInstance.defaults.baseURL

export const uploadTweet = async function (formContent, file, masterTweet) {
  let mentionnedPeople = []

  if (file == null && (formContent == null || formContent.trim().length === 0))
    return

  const filename = await uploadImage(file)
  let content = formContent == null ? '' : formContent.trim()

  if (file !== null) {
    const imageUrl = BASE_URL + '/' + filename.filename
    const mimeType = filename.mimetype
    content += '<br/>'
    if (mimeType.toLowerCase().includes('video')) {
      content += `<video onclick="event.stopPropagation()" controls muted> <source src="${imageUrl}" type="${mimeType}"/> </video>`

    } else {

      content += `<img src="${imageUrl}" alt="test"/>`
    }
  }
  const data = { content, mentionnedPeople }
  if (masterTweet != null) {
    data['masterTweetId'] = masterTweet.tweet.uid
  }
  return await postTweet(data)
}

const uploadImage = async (file) => {
  return await postMedia(file)
}