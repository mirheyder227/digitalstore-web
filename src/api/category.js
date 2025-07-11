import { instance } from "./index";

export const getAllCategories = async () =>{
  const result = await instance.get("/categories?populate=*")
  return result.data
}


