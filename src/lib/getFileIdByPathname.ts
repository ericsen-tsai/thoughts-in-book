const getFileIdByPathname = (pathname: string) => {
  const match = pathname.match(/\/(\d+)$/);
  return match ? match[1] : "";
};

export default getFileIdByPathname;
