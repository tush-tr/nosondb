const fs = require("fs");
const crypto = require("crypto");

class NosonDb {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repo requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf-8" })
    );
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
  async getAllBy(filters) {
    const records = await this.getAll();
    const result = [];
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        result.push(record);
      }
    }
    return result;
  }
  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
    return attrs;
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record ${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
}

module.exports = NosonDb;
