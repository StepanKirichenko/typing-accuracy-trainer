export function newElement(tag, classList = "", text = "", id = "") {
  const element = document.createElement(tag);
  if (classList !== "") {
    element.classList = classList;
  }
  if (text !== "") {
    element.innerText = text;
  }
  if (id !== "") {
    element.id = id;
  }
  return element;
}
