export function generateId(prefix = 'med') {
  const timePart = Date.now().toString();
  const randomPart = Math.random().toString(16).slice(2, 8);
  return `${prefix}-${timePart}-${randomPart}`;
}