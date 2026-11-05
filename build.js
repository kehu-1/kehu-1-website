const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const folders = ['products', 'partners', 'stories', 'news'];
const data = {};

folders.forEach(folder => {
  const dirPath = path.join(__dirname, 'content', folder);
  data[folder] = [];
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      try {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 提取 --- 之间的 YAML 数据
        const parts = content.split('---');
        let meta = {};
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          meta = yaml.load(frontmatter) || {};
        }
        
        data[folder].push({
          filename: file,
          ...meta
        });
      } catch (err) {
        console.error(`读取文件 ${file} 失败:`, err);
      }
    });
  }
});

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));
console.log('数据打包完成！');
