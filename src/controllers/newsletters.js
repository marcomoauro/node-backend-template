import log from "../log.js";
import Newsletter from "../models/Newsletter.js";
import {APIError500} from "../errors.js";

export const getNewsletter = async ({id}) => {
  if (!process.env.DATABASE_URL) throw new APIError500('env variable `DATABASE_URL` not set.')

  id = parseInt(id)

  log.info('Controller::newsletters::getNewsletter', {id})

  const newsletter = await Newsletter.get(id)

  return newsletter
}