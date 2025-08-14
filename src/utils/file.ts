import { RcFile } from 'antd/es/upload';

// 根据文件扩展名获取 Content-Type
export function getContentType(filename) {
  const extension = filename.split('.').pop().toLowerCase();

  const typeMap = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',

    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.ms-excel',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',

    // 压缩文件
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',

    // 默认
    default: 'application/octet-stream',
  };

  return typeMap[extension] || typeMap.default;
}
