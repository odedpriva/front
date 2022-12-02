import Moment from 'moment';

const IP_ADDRESS_REGEX = /([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})(:([0-9]{1,5}))?/

type JSONValue =
  | string
  | number
  | boolean
  | unknown


export class Utils {
  static isIpAddress = (address: string): boolean => IP_ADDRESS_REGEX.test(address)
  static lineNumbersInString = (code: string): number => code.split("\n").length;

  static humanFileSize(bytes: number, si = false, dp = 1): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
  }

  static padTo2Digits = (num: number): string => {
    return String(num).padStart(2, '0');
  }

  static getHoursAndMinutes = (protocolTimeKey: string): string => {
    const time = new Date(protocolTimeKey)
    const hoursAndMinutes = Utils.padTo2Digits(time.getHours()) + ':' + Utils.padTo2Digits(time.getMinutes());
    return hoursAndMinutes;
  }

  static formatDate = (date: string): string => {
    const d = new Date(date),
      year = d.getFullYear();

    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();

    const hoursAndMinutes = Utils.getHoursAndMinutes(date);
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    const newDate = [year, month, day].join('-');
    return [hoursAndMinutes, newDate].join(' ');
  }

  static createUniqueObjArrayByProp = (objArray: unknown[], prop: string): unknown => {
    const map = new Map(objArray.map((item) => [item[prop], item])).values()
    return Array.from(map);
  }

  static isJson = (str: string): boolean => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  static downloadFile = (data: string, filename: string, fileType: string): void => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    a.remove();
  }

  static exportToJson = (data: JSONValue, name: string): void => {
    Utils.downloadFile(JSON.stringify(data), `${name}.json`, 'text/json')
  }

  static getTimeFormatted = (time: Moment.MomentInput): string => {
    return Moment(time).utc().format('MM/DD/YYYY, h:mm:ss.SSS A')
  }

  static getNow = (format = 'MM/DD/YYYY, HH:mm:ss.SSS'): string => {
    return Moment().format(format)
  }
}
