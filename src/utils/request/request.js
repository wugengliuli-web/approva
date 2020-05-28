import requestAxios from './request.axios';


export default function request(url, options, headerConfig, headerOptions) {
  return requestAxios(url, options, headerConfig, headerOptions);
}
