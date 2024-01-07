import {APIError422, APIError500} from "../errors.js";

export const throw422 = () => {
  throw new APIError422()
}

export const throw500 = () => {
  throw new APIError500()
}