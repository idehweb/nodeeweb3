export async function populateTitle(model, initems = []) {
  const memo = {};
  for (const initem of initems) {
    const number = initem.data?.number?.slice(0, 2);
    if (!number) continue;
    if (memo[number]) initem.data.spec_title = memo[number];
    else {
      const titleDoc = await model.findOne({ number }, 'title number').lean();
      if (!titleDoc) continue;

      const titleObj = { title: titleDoc.title, number: titleDoc.number };

      // cache
      memo[number] = titleObj;

      //   save
      initem.data.spec_title = titleObj;
    }
  }

  return initems;
}
