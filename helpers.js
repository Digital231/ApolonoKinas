//truncate text in script.js
export function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
//assign random ID to movie in script.js
export function getRandomId() {
  let randomId = Math.floor(Math.random() * 10000);
  return randomId;
}
