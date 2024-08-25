/* eslint-disable @typescript-eslint/tslint/config */
import {
  ApiExceptionConfig,
  ApiPropertyConfig,
  ApiResponseConfig,
  IGenHtmlConfig,
} from './api-info';
import { sanitizeJson } from './helper';
import { ObjectMap } from './object-map';
import { TABLE_HEADER_TYPE } from './swagger-html.dto';

//#region "generate html"
export function generateRowHtml(content: string, isName = false): string {
  if (isName) {
    return `<td>${content}</td>`;
  }
  return `<td><pre>${content}</pre></td>`;
}

export function generateApiPropertyHtml(
  mapName: string,
  currentKey: string,
  fatherName = '',
): string {
  let tableBody = '';
  fatherName = fatherName.length > 0 ? `<code>${fatherName}</code>.` : '';
  let map = ObjectMap.map[mapName];
  if (!map || map.length <= 0) {
    throw new Error(`Object ${mapName} not found in system config`);
  }

  if (ObjectMap.extends[mapName]) {
    ObjectMap.copyProperties(ObjectMap.extends[mapName], mapName);
  }

  map = ObjectMap.map[mapName];

  map.forEach(
    (row: ApiPropertyConfig | ApiExceptionConfig | ApiResponseConfig) => {
      tableBody += '<tr>';

      switch (currentKey) {
        case TABLE_HEADER_TYPE.API_PROPERTIES.name:
          tableBody += `${generateRowHtml(
            `${fatherName}<code>${row.propertyName}</code>`,
            true,
          )}`;
          tableBody += `${generateRowHtml((row as ApiPropertyConfig).type)}`;
          tableBody += `${generateRowHtml(
            (row as ApiPropertyConfig).constraint,
          )}`;
          tableBody += `${generateRowHtml(
            (row as ApiPropertyConfig).isRequired + '',
          )}`;
          break;
        case TABLE_HEADER_TYPE.API_EXCEPTION.name:
          tableBody += `${generateRowHtml(row.objectName)}`;
          tableBody += `${generateRowHtml(
            (row as ApiExceptionConfig).statusCode,
          )}`;
          tableBody += `${generateRowHtml(
            (row as ApiExceptionConfig).errorCode,
          )}`;
          break;
        case TABLE_HEADER_TYPE.API_RESPONSE.name:
          tableBody += `${generateRowHtml(
            `${fatherName}<code>${row.propertyName}</code>`,
            true,
          )}`;
          tableBody += `${generateRowHtml((row as ApiResponseConfig).type)}`;
          break;
      }
      tableBody += `${generateRowHtml(row.description)}`;
      tableBody += `${generateRowHtml(sanitizeJson(row.example ?? ''))}`;
      tableBody += '</tr>';
      if ('children' in row && row.children?.length > 0) {
        row.children.forEach((child) => {
          tableBody += generateApiPropertyHtml(
            child,
            currentKey,
            row.propertyName,
          );
        });
      }
    },
  );

  return tableBody;
}

export function genHTML(data: IGenHtmlConfig): string {
  const { mapNames, headers, title, description } = data;
  let currentKey = '';
  Object.keys(TABLE_HEADER_TYPE).forEach((key) => {
    if (TABLE_HEADER_TYPE[key] === headers) {
      currentKey = key;
      return;
    }
  });

  if (currentKey === '') {
    throw new Error('Invalid Headers, please using "TABLE_HEADER_TYPE"');
  }
  let tableBody = '';
  mapNames.forEach((mapName) => {
    tableBody += generateApiPropertyHtml(mapName, currentKey);
  });
  let tableHeaders = '';
  return (() => {
    headers.val.forEach((column: string) => {
      tableHeaders += `<th><b>${column}</b></th>`;
    });
    const titleHtml =
      title?.length > 0 ? `<div><h1><b>${title}</b></h1></div>` : '';
    const descriptionHtml =
      description?.length > 0 ? `<div><i>${description}</i></div>` : '';
    return `${
      titleHtml + descriptionHtml
    }<table><thead><tr>${tableHeaders}</tr></thead><tbody>${tableBody}</tbody></table>`;
  })();
}

export function generateHeaderDescriptionsHtml(
  configs: IGenHtmlConfig[],
): string {
  let html = '';
  configs.forEach((config) => {
    html += genHTML(config);
  });

  return html;
}

//#endregion
