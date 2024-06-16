// lib.module.js
// import lib
import * as FileSaver from "./filesaver.js";
import * as JSZip from "./jszip.min.js";
import * as api from "./api.js";

window.notificationOptions = {
    wrapperId: 'notificationWrapper',
    templateFile: 'https://gigamaster.github.io/codemo/asset/notification.html',
    autoClose: 3000,
    autoRemove: 4000,
  }