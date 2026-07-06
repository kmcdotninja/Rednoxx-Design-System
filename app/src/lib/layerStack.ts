/** Global stack of open overlay layers (drawers/modals) so that Escape only
 *  ever closes the topmost one — nested viewers close before their parents. */
const stack: symbol[] = []

export function pushLayer(id: symbol) {
  stack.push(id)
}

export function popLayer(id: symbol) {
  const i = stack.lastIndexOf(id)
  if (i !== -1) stack.splice(i, 1)
}

export function isTopLayer(id: symbol): boolean {
  return stack[stack.length - 1] === id
}
