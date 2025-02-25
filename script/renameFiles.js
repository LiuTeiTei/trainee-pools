const fs = require('fs');
const path = require('path');

function renameFiles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`无法读取目录: ${dir}`, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`无法获取文件信息: ${filePath}`, err);
                    return;
                }

                if (stats.isDirectory()) {
                    renameFiles(filePath);
                } else {
                    const newFileName = file.replace(/\[(\d+)\]\[(.*?)\.jpg\]\.comikon$/, '$1.$2.jpg');
                    if (newFileName !== file) {
                        const newFilePath = path.join(dir, newFileName);
                        fs.rename(filePath, newFilePath, err => {
                            if (err) {
                                console.error(`无法重命名文件: ${filePath}`, err);
                            } else {
                                console.log(`文件重命名: ${filePath} -> ${newFilePath}`);
                            }
                        });
                    }
                }
            });
        });
    });
}

const directoryPath = path.join(__dirname);
renameFiles(directoryPath);
