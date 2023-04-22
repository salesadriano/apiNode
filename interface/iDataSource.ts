import iColumn from "./iColumn";

interface iDataSource {
  schema?: string | undefined;
  sourceName: string | undefined;
  type?: string | undefined;
};

export default iDataSource;