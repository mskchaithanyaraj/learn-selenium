import * as fs from 'fs';
import * as path from 'path';
import { topicContents } from './src/data/moduleContent';

const outDir = path.join(__dirname, 'src/data/contents');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

topicContents.forEach(topic => {
  const filePath = path.join(outDir, `${topic.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(topic, null, 2), 'utf8');
  console.log(`Wrote ${topic.id}.json`);
});
console.log(`Extracted ${topicContents.length} topics successfully.`);
