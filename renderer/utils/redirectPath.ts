const redirectPath = (url: string) => {
  // let convertedUrl = process.env.NODE_ENV === 'production' ? `${url}.html` : url;

  location.assign(url);
};

export default redirectPath;
