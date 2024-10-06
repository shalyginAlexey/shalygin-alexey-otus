const { JSDOM } = require("jsdom");

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <div class="someclass">
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  </body>
</html>
`);

const document = dom.window.document;

function getPath(element) {
  const getSelector = (el) => {
    if (el.id) {
      return `${el.tagName.toLowerCase()}#${el.id}`;
    } else if (el.className) {
      return `${el.tagName.toLowerCase()}.${el.className
        .trim()
        .replace(/\s+/g, ".")}`;
    } else {
      return el.tagName.toLowerCase();
    }
  };

  const getNthChild = (el) => {
    let sibling = el;
    let nth = 1;
    while ((sibling = sibling.previousElementSibling) != null) {
      nth++;
    }
    return nth;
  };

  const buildPath = (el) => {
    let path = [];
    while (el.parentElement) {
      let selector = getSelector(el);
      if (el.parentElement.children.length > 1) {
        selector += `:nth-child(${getNthChild(el)})`;
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(" > ");
  };

  const selector = buildPath(element);
  if (document.querySelectorAll(selector).length === 1) {
    return selector;
  } else {
    throw new Error("Невозможно создать уникальный селектор");
  }
}

const element = document.querySelector("li:first-child");
console.log(getPath(element));

// Команда для запуска npm install jsdom && node lesson_4.js
