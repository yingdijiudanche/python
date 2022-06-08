/**@see {@link https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md} */
const dayjs = require('dayjs');
const utcPlugin = require('dayjs/plugin/utc');
const ExcelJS = require('exceljs');
const typeText = ['New', 'Refreshment'];
const stateText = ['Active', 'InActive', 'Terminated'];
const stateColor = ['', 'FFED7D31', 'FFFF0000'];

dayjs.extend(utcPlugin);
// const dateColor = ['FFFFC000', 'FFFF0000'];
// const dateConditions = [
//   `['=IF($D3="", FALSE,TODAY()-($D3)>-90)']`,
//   `['=IF($C3="", FALSE,TODAY()-($C3)>0)']`,
// ];
const genRightDateObj = function (utcStr) {
  let d = dayjs(utcStr);
  return dayjs(d.toDate()).add(d.utcOffset(), 'minute').toDate();
};
/**
 * 将对象转换成 值数组
 * @param {UserQualify} obj
 * @returns {String[][]} cell value
 */
const transformValue = function (obj) {
  let { expiryDate, state, type, inactiveReason, lastTimeUse, qualifyName, adminName } = obj;

  return [
    adminName,
    qualifyName,
    expiryDate ? genRightDateObj(expiryDate) : '',
    stateText[state],
    inactiveReason,
    lastTimeUse ? genRightDateObj(lastTimeUse) : '',
    typeText[type],
  ];
};
/**
 * 制作表头标题部分
 * @param {ExcelJS.Worksheet} sheet
 */
const makeTopRows = function (sheet) {
  const titles = [
    ['A1', 'Name of Application'],
    ['B1', 'Valid Qualification Type'],
    ['C1', 'Valid Until'],
    ['D1', 'Active / Inactive / Terminated?'],
    ['E1', 'Inactive / Terminated Reason'],
    ['F1', 'Last Report SC Date'],
    ['G1', 'New Application / Refreshment'],
  ];
  titles.forEach((v, i) => {
    sheet.getCell(v[0]).value = v[1];
  });
};
/**
 * 
* @param {ExcelJS.Worksheet} sheet
 * @param {number} end 数据结束行号

 */
const setStyle = function (sheet) {
  const columnWidth = [20, 19, 10, 11, 10, 10, 11];
  columnWidth.forEach((v, i) => {
    sheet.getColumn(i + 1).width = v;
  });
  sheet.getRow(1).height = 70;

  const centerSty = { horizontal: 'center', vertical: 'middle', wrapText: true };

  sheet.getCell('A1').alignment = centerSty;
  //除了第一列，其他列文字都居中
  for (let i = 2; i <= columnWidth.length; i++) {
    sheet.getColumn(i).alignment = centerSty;
  }
  for (let i = 1; i <= columnWidth.length; i++) {
    sheet.getColumn(i).font = {
      name: 'Times New Roman',
      size: 10,
    };
  }
  let firstRow = sheet.getRow(1);
  firstRow.font = { name: 'Times New Roman', size: 10, bold: true };
  for (let i = 1; i <= columnWidth.length; i++) {
    let cell = firstRow.getCell(i);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00FFFF00' },
    };
    cell.border = {
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    };
  }
};
/**
 * 插入动态数据
 * @param {ExcelJS.Worksheet} sheet
 * @param {number} begin 数据起始行号
 * @param {UserQualify[]} datas 数据结束行号
 * @returns {Number} 实际数据行数
 */
const makeDataRows = function (sheet, begin, datas) {
  let total = 0;
  let mergesRows = [];
  for (let i = 0; i < datas.length; i++) {
    let rows = datas[i].map(transformValue);
    if (rows.length >= 2) {
      mergesRows.push(`A${begin}:A${begin + rows.length - 1}`);
    }
    rows.map((v, j) => {
      sheet.getRow(begin + j).values = v;
      total++;
    });
    begin = begin + rows.length;
  }
  mergesRows.forEach(v => {
    sheet.mergeCells(v);
    sheet.getCell(v.split(':')[0]).alignment = { vertical: 'middle' };
  });

  return total;
};

/**
 *
 * @param {ExcelJS.Worksheet} sheet
 * @param {number} end 数据结束行号
 */
const makeBottomRows = function (sheet, end) {
  let cell = sheet.getCell(`A${end + 5}`);
  cell.value = new Date();
  cell.numFmt = 'YYYY';
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '00FFFF00' },
  };
};

const startMaker = function (workbook, datas) {
  /**@type {ExcelJS.Worksheet} */
  const sheet = workbook.addWorksheet('CP-FM');
  const begin = 2;
  makeTopRows(sheet);
  setStyle(sheet);
  const dataLen = makeDataRows(sheet, begin + 1, datas);
  makeBottomRows(sheet, dataLen);

  sheet.autoFilter = `A${begin}:G${dataLen}`;

  for (let i = 1; i < stateText.length; i++) {
    let text = stateText[i];
    let argb = stateColor[i];
    let rules = [
      {
        type: 'containsText',
        operator: 'containsText',
        text,
        style: {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            bgColor: { argb },
          },
        },
      },
    ];
    let rule = {
      ref: `D3:D${3 + dataLen}`,
      rules,
    };
    sheet.addConditionalFormatting(rule);
  }
  // let dateRules = [];
  // for (let i = 1; i < dateColor.length; i++) {
  //   let argb = dateColor[i];
  //   let rules = [
  //     {
  //       type: 'expression',
  //       formulae: dateConditions[i],

  //       style: {
  //         fill: {
  //           type: 'pattern',
  //           pattern: 'solid',
  //           bgColor: { argb },
  //         },
  //       },
  //     },
  //   ];
  //   dateRules.push(rules);
  // }
  // let dateRule = {
  //   ref: `C3:C${3 + dataLen}`,
  //   rules: dateRules,
  // };
  // sheet.addConditionalFormatting(dateRule);

  let max = dataLen + 3;
  for (let i = 3; i < max; i++) {
    sheet.getCell(`C${i}`).numFmt = 'MMM-YY';
    sheet.getCell(`F${i}`).numFmt = 'DD-MMM-YY';
  }
};
/**

 * @param {import('express').Response} res
 * @param {()=>void} [afterExport]
 */
module.exports = async function (datas, res, afterExport) {
  const workbook = new ExcelJS.Workbook();
  startMaker(workbook, datas);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=' + 'QualificationRecord.xlsx');

  return workbook.xlsx.write(res).then(function () {
    afterExport && afterExport();
    res.status(200).end();
  });
};

/**
 *@typedef {object} UserQualify
 *@property {{adminId:string}} _id
 *@property {Qualify[]} aqs
 *
 *
 * @typedef {Object} Qualify
 * @property {String} adminId
 * @property {String} qualifyId
 * @property {String} expiryDate
 * @property {String} lastTimeUse
 * @property {number} state 'Active'|'Inactive'|'Terminated'
 * @property {number} type 'New Application'|'Refreshment'
 * @property {String} inactiveReason
 *
 */
