/* eslint-disable radix */
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';
import {strings} from '../Locate/I18n';
import I18n from 'react-native-i18n';
import {Config} from '../Config';

const chunk = (array, size) => {
  const chunkedArr = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
};

const timeConverter = (UNIX_timestamp, format) => {
  const timeZone = RNLocalize.getTimeZone();
  const time = moment(UNIX_timestamp).tz(timeZone).format(format);
  return time;
};

const formatBytes = (bytes, decimals) => {
  if (bytes === 0) {
    return '0 GB';
  }
  if (isNaN(parseInt(bytes))) {
    return bytes;
  }
  if (typeof bytes === 'string') {
    bytes = parseInt(bytes);
  }
  if (bytes === 0) {
    return '0';
  }
  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const getTimeAgo = (timestamp) => {
  if (moment().subtract(1, 'years').unix() * 1000 > timestamp) {
    const years = new Date().getYear() - new Date(timestamp).getYear();
    return `${years} ${years === 1 ? strings('year') : strings('years')}`;
  }
  if (moment().subtract(1, 'months').unix() * 1000 > timestamp) {
    const months = new Date().getMonth() - new Date(timestamp).getMonth();
    return `${months < 0 ? months + 12 : months} ${
      months === 1 ? strings('month') : strings('months')
    }`;
  }
  if (moment().subtract(1, 'days').unix() * 1000 > timestamp) {
    const days = new Date().getDate() - new Date(timestamp).getDate();
    const numberDaysOfLastMonth = moment().subtract(1, 'months').daysInMonth();
    return `${days < 0 ? days + numberDaysOfLastMonth : days} ${
      days === 1 ? strings('day') : strings('days')
    }`;
  }
  if (moment().subtract(1, 'hours').unix() * 1000 > timestamp) {
    const hours = new Date().getHours() - new Date(timestamp).getHours();
    return `${hours < 0 ? hours + 24 : hours} ${
      hours === 1 ? strings('hour') : strings('hours')
    }`;
  }
  if (moment().subtract(1, 'minutes').unix() * 1000 > timestamp) {
    const minutes = new Date().getMinutes() - new Date(timestamp).getMinutes();
    return `${minutes < 0 ? minutes + 60 : minutes} ${
      minutes === 1 ? strings('minute') : strings('minutes')
    }`;
  }
  const seconds = parseInt((new Date().getTime() - timestamp) / 1000);
  return `${seconds} ${seconds === 1 ? strings('second') : strings('seconds')}`;
};

const defineLanguage = () => {
  let language = 'en';
  if (I18n.currentLocale().includes('vi')) {
    language = 'vi';
  } else if (I18n.currentLocale().includes('ja')) {
    language = 'jp';
  }
  return language;
};

function getFileType(file) {
  const FileTypes = {
    JPG: 'image/jpeg',
    PNG: 'image/png',
  };

  const filename = file.filename || file.uri;
  const fileType = filename.split('.').pop();
  return FileTypes[fileType.toUpperCase()];
}

function calculateRateSurvey(surveyDetail) {
  const {optionList} = surveyDetail;
  if (!optionList) {
    surveyDetail.optionList = [];
    return surveyDetail;
  }
  const reducer = (max, selection) =>
    max.totalAnsByAnsId < selection.totalAnsByAnsId ? selection : max;
  let selectionMaxRate = optionList.reduce(reducer, 0);

  let rateCount = 0;
  for (let i = 0; i < optionList.length; i++) {
    const selection = optionList[i];
    if (selection.ansImage) {
      surveyDetail.selectionImage = true;
      selection.image = {uri: Config.GET_IMAGE_URL + selection.ansImage};
    }

    if (!selection.totalAnsByAnsId) {
      selection.totalAnsByAnsId = 0;
    }
    if (!surveyDetail.totalVotes) {
      selection.rate = 0;
    } else {
      selection.rate = Math.round(
        (selection.totalAnsByAnsId * 100) / surveyDetail.totalVotes,
      );
    }
    if (selection.ansId != selectionMaxRate.ansId) {
      rateCount += selection.rate;
    }
  }
  if (surveyDetail.totalVotes > 0) {
    selectionMaxRate.rate = 100 - rateCount;
  }

  return surveyDetail;
}

function isShowIconExpire(UNIX_timestamp) {
  const timeZone = RNLocalize.getTimeZone();
  const timeCheck = moment().tz(timeZone);
  const timeExpire = moment(UNIX_timestamp).tz(timeZone);
  return timeExpire.diff(timeCheck, 'days') <= 10;
}

export {
  chunk,
  timeConverter,
  formatBytes,
  getTimeAgo,
  defineLanguage,
  getFileType,
  calculateRateSurvey,
  isShowIconExpire,
};
