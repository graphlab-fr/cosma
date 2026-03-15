export default function normalizeWithAliases(aliasTable, props) {
  const renamedProps = { ...props };

  for (const key of Object.keys(props)) {
    if (aliasTable[key]) {
      renamedProps[aliasTable[key]] = renamedProps[key];
      delete renamedProps[key];
    }
  }

  return renamedProps;
}
