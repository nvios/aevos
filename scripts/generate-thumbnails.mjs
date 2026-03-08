import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, '../content/recipes');
const IMAGES_DIR = path.join(__dirname, '../public/images/recipes');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function optimizeImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(1200, 800, { // 3:2 Aspect Ratio
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toFile(outputPath);
        console.log(`✅ Optimized: ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error optimizing ${path.basename(inputPath)}:`, error);
        return false;
    }
}

async function processRecipes() {
  console.log('🔄 Scanning recipes and processing images...');
  
  const files = fs.readdirSync(RECIPES_DIR).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(RECIPES_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Determine slug/base name (handle .en.md vs .md)
    const isEnglish = file.endsWith('.en.md');
    const baseName = isEnglish ? file.replace('.en.md', '') : file.replace('.md', '');
    
    // Target webp path
    const webpFilename = `${baseName}.webp`;
    const webpPath = path.join(IMAGES_DIR, webpFilename);
    const publicPath = `/images/recipes/${webpFilename}`;

    // Look for source images (jpg, jpeg, png) matching the slug
    const extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.PNG']; 
    let sourcePath = null;

    for (const ext of extensions) {
        const potentialPath = path.join(IMAGES_DIR, `${baseName}${ext}`);
        if (fs.existsSync(potentialPath)) {
            sourcePath = potentialPath;
            break;
        }
    }

    // If source found, convert and resize
    if (sourcePath) {
        // Check if we need to regenerate (e.g. if source is newer than webp, or webp missing)
        let shouldGenerate = true;
        if (fs.existsSync(webpPath)) {
            const sourceStats = fs.statSync(sourcePath);
            const webpStats = fs.statSync(webpPath);
            if (sourceStats.mtime <= webpStats.mtime) {
                shouldGenerate = false; // WebP is up to date
            }
        }

        if (shouldGenerate) {
            console.log(`📸 Found source for ${baseName}: ${path.basename(sourcePath)}`);
            const success = await optimizeImage(sourcePath, webpPath);
            if (success) {
                // Update frontmatter
                if (data.image !== publicPath) {
                    data.image = publicPath;
                    const newContent = matter.stringify(content, data);
                    fs.writeFileSync(filePath, newContent);
                    console.log(`📝 Updated frontmatter for ${file}`);
                }
            }
        } else {
             // Just ensure frontmatter is correct if image exists
             if (data.image !== publicPath) {
                data.image = publicPath;
                const newContent = matter.stringify(content, data);
                fs.writeFileSync(filePath, newContent);
                console.log(`📝 Updated frontmatter for ${file} (image existed)`);
            }
        }
    } else if (fs.existsSync(webpPath)) {
        // WebP exists but no source (maybe source was deleted or generated previously)
        if (data.image !== publicPath) {
            data.image = publicPath;
            const newContent = matter.stringify(content, data);
            fs.writeFileSync(filePath, newContent);
            console.log(`📝 Updated frontmatter for ${file} (existing webp linked)`);
        }
    } else {
        // console.log(`⚠️ No image found for ${baseName}`);
    }
  }
  console.log('✨ Done.');
}

processRecipes();