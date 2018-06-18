export function main (_require = require) {
  const reqMain = _require.main
  if (reqMain && isIISNode(reqMain)) {
    return handleIISNode(reqMain)
  }
  else {
    return reqMain ? reqMain.filename : process.cwd()
  }
}

function isIISNode (reqMain: any) {
  return /\\iisnode\\/.test(reqMain.filename)
}

function handleIISNode (reqMain: any) {
  if (!reqMain.children.length) {
    return reqMain.filename
  } else {
    return reqMain.children[0].filename
  }
}
