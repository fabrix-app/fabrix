export function main (_require = require) {
  const main = _require.main
  if (main && isIISNode(main)) return handleIISNode(main)
  else return main ? main.filename : process.cwd()
}

function isIISNode (main: any) {
  return /\\iisnode\\/.test(main.filename)
}

function handleIISNode (main: any) {
  if (!main.children.length) {
    return main.filename
  } else {
    return main.children[0].filename
  }
}
