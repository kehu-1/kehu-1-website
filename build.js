const fs = require('fs');
const path = require('path');

const folders = ['products', 'partners', 'stories', 'news'];
const data = {};

function parseMarkdown(content) {
  const parts = content.split('---');
  const frontmatter = parts[1] || '';
  const body = parts.slice(2).join('---').trim();
  const meta = {};
  
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      let key = match[1].trim();
      let val = match[2].trim().replace(/^['"]|['"]$/g, '');
      meta[key] = val;
    }
  });
  return { meta, body };
}

folders.forEach(folder => {
  const dirPath = path.join(__dirname, 'content', folder);
  data[folder] = [];
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      try {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { meta, body } = parseMarkdown(content);
        data[folder].push({
          filename: file,
          ...meta,
          body: body
        });
      } catch (err) {
        console.error(`读取文件 ${file} 失败:`, err);
      }
    });
  }
});

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));
console.log('数据打包完成！共处理文件数：', folders.reduce((acc, f) => acc + data[f].length, 0));
