import { saveToDB } from "./utils";

export const handler = async (event: any) => {
  console.log(JSON.stringify(event));
  try {
    const orderId = await saveToDB(event);
    return orderId;
  } catch (error) {
    console.log(error);
    return null;
  }
};
