import {APIError404, APIError500} from "../errors.js";

export const throw404 = () => {
  throw new APIError404()
}

export const throw500 = () => {
  throw new APIError500()
}