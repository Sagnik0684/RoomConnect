import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  // console.log(res);
  
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  // splittting the url and taking the secodn part
  const query = request.url.split("?")[1];
  
  // const res = await apiRequest("/posts?" + query);
  // return res.data;

  const postPromise = apiRequest("/posts?" + query);
  // console.log(postPromise);
  

  // defer is used for showing suspense componeent while fetching data
  // basically a loader
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  // console.log(chatPromise);

  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
