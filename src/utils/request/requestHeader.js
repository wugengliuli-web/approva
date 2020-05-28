import tokenHandler from '../tokenHandler';

export const REQUEST_HEADER_LIST = {
  WITH_OUT_TOKEN_TYPE: 'WITH_OUT_TOKEN_TYPE',
  FILE_DOWN_TYPE: 'FILE_DOWN_TYPE',
  IMAGE_TYPE: 'IMAGE_TYPE',
  FILE_UPLOAD_TYPE: 'FILE_UPLOAD_TYPE',
  EXPORT_TYPE: 'EXPORT_TYPE',
  DEFAULT: 'DEFAULT',
  FORMS_CONFIRM_TYPE: 'FORMS_CONFIRM_TYPE',
  PHONE_CODE: 'PHONE_CODE',
  USER_PERMISS: "USER_PERMISS"
};

export function getHeaderObject(typeStr, data = {}) {
  let config = {}
  switch (typeStr) {
    case 'WITH_OUT_TOKEN_TYPE':
      config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
      break;
    case 'FILE_DOWN_TYPE':
      config = {
        headers : {
          // token : tokenHandler.getSessionByKey('token'),
        },
        responseType: 'blob',
      };
      break;
    case 'EXPORT_TYPE':
      config = {
        headers: {
          // token: tokenHandler.getSessionByKey('token'),
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
        },
        responseType: 'blob',
      };
      break;
    case 'IMAGE_TYPE':
      config = {
        headers: {
          // token: tokenHandler.getSessionByKey('token'),
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
          Accept: 'image/png',
        },
        responseType: 'arraybuffer',
      };
      break;
    case 'FILE_UPLOAD_TYPE':
      config = {
        headers: {
          token: tokenHandler.getSessionByKey('token'),
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json',
      };
      break;
    case 'FORMS_CONFIRM_TYPE':
      config = {
        headers: {
          // token: tokenHandler.getSessionByKey('token'),
          //token: '4500fe68-4d7a-4777-9f5f-b5025d6a72cc',
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
          // 'X-Requested-Contact':'WESIGN20200110094544560',
          // 'X-Requested-Captcha':285829,
          'X-Requested-Contact': tokenHandler.getSessionByKey('Contact'),
          'X-Requested-Captcha': tokenHandler.getSessionByKey('Captcha'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
      break;
    case 'PHONE_CODE':
      config = {
        headers: {
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
          'X-Requested-Captcha': tokenHandler.getSessionByKey('X-Requested-Captcha'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
      break;
    case 'USER_PERMISS':
      config = {
        headers: {
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
          'X-Internal-Service-Request': true,
          'X-Requested-Id-Euser': tokenHandler.getSessionByKey('userWsid'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
      break;
    default:
      config = {
        headers: {
          //token: tokenHandler.getSessionByKey('token'),
          //token: '4500fe68-4d7a-4777-9f5f-b5025d6a72cc',
          'X-Requested-Session': tokenHandler.getSessionByKey('Session'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
  }
  config.headers = Object.assign(config.headers, data)
  return config;
}
