const { readdir } = require("fs").promises;
const printTree = require("./lesson_1");

const args = process.argv.slice(2);
const rootDir = args[0] || ".";
const depth = args.includes("-d") ? parseInt(args[args.indexOf("-d") + 1]) : 10;

const buildTree = async (dir, level = 0) => {
  if (level > depth) return { items: [], directories: 0, files: 0 };

  const files = await readdir(dir, { withFileTypes: true });
  let directories = 0;
  let filesCount = 0;
  const items = [];

  for (const file of files) {
    if (file.name === ".git") continue;

    if (file.isDirectory()) {
      directories++;
      const result = await buildTree(`${dir}/${file.name}`, level + 1);
      items.push({ name: file.name, items: result.items });
      directories += result.directories;
      filesCount += result.files;
    } else {
      filesCount++;
      items.push({ name: file.name });
    }
  }

  return {
    name: dir,
    items,
    directories,
    files: filesCount,
  };
};

buildTree(rootDir).then((result) => {
  printTree({ name: result.name, items: result.items });
  console.log(`${result.directories} directories, ${result.files} files`);
});
