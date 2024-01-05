import log from '../log.js'
import db from '../database.js'
import {APIError404} from "../errors.js";

export default class Newsletter {
  id
  description

  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]))
  }

  static fromDBRow = (row) => {
    const newsletter = new Newsletter({
      id: row.id,
      description: row.description,
    })

    return newsletter
  }

  static get = async (id) => {
    log.info('Model::Newsletter::get', {id})

    const row = await db.oneOrNone(`
        select *
        from _newsletters_template
        where id = $1
    `, [id]);

    if (!row) throw new APIError404('Newsletter not found.')

    const newsletter = Newsletter.fromDBRow(row)

    return newsletter
  }
}