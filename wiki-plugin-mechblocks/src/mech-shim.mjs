// Stands in for Ward's src/client/mech.js inside our bundle. That file
// registers window.plugins.mech as a side effect; importing it here would
// replace Ward's live plugin with our copy. Only its three helpers are needed.
export const uniq = (value, index, self) => self.indexOf(value) === index
export const delay = time => new Promise(res => setTimeout(res, time))
export const asSlug = title =>
  title
    .replace(/\s/g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .toLowerCase()
