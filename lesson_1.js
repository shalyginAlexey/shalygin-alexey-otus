const data = {
  name: 1,
  items: [
    {
      name: 2,
      items: [{ name: 3 }, { name: 4 }],
    },
    {
      name: 5,
      items: [{ name: 6 }],
    },
  ],
};

const printTree = (data, prefix = "") => {
  console.log(prefix + data.name);

  if (data.items) {
    for (let i = 0; i < data.items.length; i++) {
      const isLast = i === data.items.length - 1;
      if (prefix === "├──") prefix = "| ";
      if (prefix === "└──" && isLast) prefix = "  ";
      printTree(data.items[i], prefix + (isLast ? "└──" : "├──"));
    }
  }
};

printTree(data);
