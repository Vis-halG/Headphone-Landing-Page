import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const backupDir = './model_backup';
const targetDir = './model';

const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.glb'));

console.log(`Found ${files.length} models to optimize...`);

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

for (const file of files) {
  const inputPath = path.join(backupDir, file);
  const outputPath = path.join(targetDir, file);
  const origSize = fs.statSync(inputPath).size;
  totalOriginalSize += origSize;

  console.log(`\nOptimizing ${file} (${(origSize / 1024 / 1024).toFixed(2)} MB)...`);
  
  try {
    // Run gltf-transform optimize with draco and webp
    execSync(`npx @gltf-transform/cli optimize "${inputPath}" "${outputPath}" --compress draco --texture-compress webp`, {
      stdio: 'inherit'
    });
    
    const newSize = fs.statSync(outputPath).size;
    totalOptimizedSize += newSize;
    const savings = ((1 - (newSize / origSize)) * 100).toFixed(1);
    console.log(`✓ ${file}: ${(origSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (${savings}% reduction)`);
  } catch (err) {
    console.error(`Error optimizing ${file}:`, err.message);
  }
}

console.log('\n========================================');
console.log(`Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Overall Savings: ${((1 - (totalOptimizedSize / totalOriginalSize)) * 100).toFixed(1)}%`);
console.log('========================================');
