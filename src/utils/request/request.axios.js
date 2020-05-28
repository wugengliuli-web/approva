import axios from 'axios';
import { handleStatusError } from './checkStatus';
import checkCode from './checkCode';
import { REQUEST_HEADER_LIST, getHeaderObject } from './requestHeader';

export default function axiosRequest(url, options, headerConfig = REQUEST_HEADER_LIST.DEFAULT, headerOptions) {
  let config = {};
  config = getHeaderObject(headerConfig, headerOptions);
  const newOptions = { ...config, ...options};

  newOptions.url = url;
  if ('method' in newOptions) {
    newOptions.method = newOptions.method.toUpperCase();
  } else {
    newOptions.method = 'GET';
  }

  if (newOptions.method !== 'GET') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.data = JSON.stringify(newOptions.body);
    } else {
      newOptions.data = newOptions.body;
    }
  } else {
    newOptions.params = newOptions.body;
  }
  axios.defaults.withCredentials = true; // `withCredentials` 表示跨域请求时是否需要使用凭证
  return axios(newOptions).then(response =>
    checkCode(url, response),
  ).catch(handleStatusError);
}
