import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (theBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, theBlog, config);
  return response.data;
};

const update = async (theBlog) => {
  const response = await axios.put(`${baseUrl}/${theBlog.id}`, theBlog);
  return response.data;
};

const remove = async (theBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${theBlog.id}`, config);
};

export default { setToken, getAll, create, update, remove };
