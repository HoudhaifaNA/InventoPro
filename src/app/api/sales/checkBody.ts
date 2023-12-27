const checkBodyData = (body: any) => {
  const { type } = body;

  if (!['wholesale', 'retail'].includes(type)) {
    throw Error('Invalid type');
  }
};

export default checkBodyData;
