class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, options = {}) {
    const [document] = await this.model.create([data], options);
    return document;
  }

  async findById(id, options = {}) {
    return this.model.findById(id, options);
  }

  async findOne(filter, options = {}) {
    return this.model.findOne(filter, options);
  }

  async findMany(filter = {}, options = {}) {
    return this.model.find(filter, options);
  }

  async updateById(id, update, options = {}) {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async deleteById(id, options = {}) {
    return this.model.findByIdAndDelete(id, options);
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

export default BaseRepository;