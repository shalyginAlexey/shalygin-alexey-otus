function deepEqual(obj1, obj2, path = "") {
  if (obj1 === obj2) {
    return "OK";
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return `Error: ${path}`;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return `Error: ${path}`;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return `Error: ${path}`;
    }

    const result = deepEqual(
      obj1[key],
      obj2[key],
      path ? `${path}.${key}` : key
    );

    if (result !== "OK") {
      return result;
    }
  }

  return "OK";
}

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};

console.log(deepEqual(obj1, obj1));
console.log(deepEqual(obj1, obj2));
console.log(deepEqual(obj1, obj3));
