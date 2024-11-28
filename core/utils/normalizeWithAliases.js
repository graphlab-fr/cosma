export default function normalizeWithAliases(aliasTable, props) {
  let renamedProps = { ...props };

  for (let key of Object.keys(props)) {
    if (aliasTable[key]) {
      renamedProps[aliasTable[key]] = renamedProps[key];
      delete renamedProps[key];
    }
  }

  return renamedProps;
}
