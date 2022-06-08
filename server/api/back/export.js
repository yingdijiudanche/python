// const Daily = require('../../models/daily');
// const Guard = require('../../models/guard');
// const admin_qualification = require('../../models/admin_qualification');
// const daily2excel = require('../../utils/daily2excel');
// const { groupByKey } = require('../../utils/arrayEnhance');
// const qualify2excel = require('../../utils/qualify2excel');
// const decodeDsl = require('../../utils/decodeDsl');
// const Unit = require('../../models/unit');
// const puppeteer = require('puppeteer');
// /**
//  * @type {import('..').NormalApi}
//  */
// module.exports = {
//   'get /back/export/daily/excel/:guardId': async function (req, res, next) {
//     const guard = await Guard.findById(req.params.guardId).catch(e => res.json(e.message));
//     if (!guard) {
//       res.set('Content-Type', 'text/html');
//       res.send('<h5 style="color:red">The link expired!</h5>');
//       return;
//     }
//     let { page, limit, sort, ...rest } = decodeDsl(guard.query);
//     let populate = [
//       'lastModifyPerson',
//       'contractNo',
//       'projectDesc',
//       'adminQualifications.adminName',
//       'adminQualifications.qualifyNames',
//       'ksCost.unitName',
//       'subCost.name',
//       'subCost.cost.unitName',
//     ];
//     const datas = await Daily.find(rest).sort(sort).populate(populate);
//     const units = await Unit.find();
//     daily2excel(datas, units, res, () => {
//       Guard.findByIdAndDelete(req.params.guardId).catch(e => console.warn(e.message));
//     });
//   },

//   'get /back/export/qualify/excel/:guardId': async function (req, res, next) {
//     const guard = await Guard.findById(req.params.guardId).catch(e => res.json(e.message));
//     if (!guard) {
//       res.set('Content-Type', 'text/html');
//       res.send('<h5 style="color:red">The link expired!</h5>');
//       return;
//     }

//     let datas = await admin_qualification.find().populate('lastTimeUse qualifyName adminName');
//     let groupedBydAdminId = groupByKey(v => v.adminId.toString(), datas);
//     // console.log(groupedBydAdminId);
//     qualify2excel(groupedBydAdminId, res, () => {
//       Guard.findByIdAndDelete(req.params.guardId).catch(e => console.warn(e.message));
//     });
//   },
//   'get /back/export/inspection/pdf/:id': async function (req, res, next) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(`http://localhost:31002/inspection.html?id=${req.params.id}`, {
//       waitUntil: 'networkidle0',
//     });
//     const pdf = await page.pdf({
//       format: 'A4',
//       margin: {
//         top: '10mm',
//         left: '10mm',
//         right: '10mm',
//         bottom: '10mm',
//       },
//     });

//     await browser.close();

//     res.contentType('application/pdf');
//     res.set({
//       'Content-Disposition': `Safety-Inspection.pdf`,
//     });
//     res.end(pdf);
//   },
// };
