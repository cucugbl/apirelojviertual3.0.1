"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarLicencia = void 0;
const cron_1 = require("cron");
const empresa_controller_1 = require("../controllers/empresa.controller");
exports.verificarLicencia = new cron_1.CronJob('1 1 * * * *', function () {
    empresa_controller_1.verificarLicenciaBDD();
});
