const phoneRegular = {
  reg: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
  msg: '手机号输入有误',
};

const idCardRegular = {
  reg: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  msg: '身份证号输入有误',
};
const emailRegular = {
  reg: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,20}$/,
  msg: '邮箱号输入有误',
};
const postalCodeRegular = {
  reg: /^[1-9][0-9]{5}$/,
  msg: '邮政编码输入有误',
};

const delectBeforeAndBehindBlackRegular = {
  reg: /(^\s*)|(\s*$)/g,
  msg: 'replace之后去除前后空格',
};

const fixedTelephoneRegular = {
  reg: /^\d{3}-\d{5,10}|\d{4}-\d{5,8}$/,
  msg: '固定电话有误',
};

const fileNameRegular = {
  reg: /^[a-zA-Z0-9\u4e00-\u9fa5]{2,50}$/,
  msg: '文件名只能由数字，字母和中文构成,且长度不超过50',
};

const guidePrefix = {
  reg: /^\d{2}[a-zA-Z]{1,3}$/,
  msg: '指南前缀由数字和字母构成,前两位为数字，且长度不超过5',
};

const splitFileName = {
  reg: /(.*\/)*([^.]+).*/ig,
  msg: '截取文件名称'
};

const weightRegular = {
  reg: /^\d{1,2}$/,
  msg: '权重只能为0-99的数字',
}

const year = {
  reg: /^(20)[1][8,9]$|^(20)[2-4]\d$|^(20)[5][0]$/,
  msg: "年份只能为2018年到2050年！"
}

const staffName = {
  reg: /^[\u4e00-\u9fa5a-zA-Z\d\(\)]{1,20}$/,
  msg: '请输入1~20位汉字，字母或数字，特殊字符只支持中英文括号'
}

const unifiedSocialID = {
  reg: /^[a-zA-Z0-9]{18}$/,
  msg: '信用代码位数错误'
}

module.exports = {
  staffName,
  delectBeforeAndBehindBlackRegular,
  phoneRegular,
  idCardRegular,
  emailRegular,
  postalCodeRegular,
  fixedTelephoneRegular,
  fileNameRegular,
  splitFileName,
  weightRegular,
  guidePrefix,
  year,
  unifiedSocialID
};
