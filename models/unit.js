const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    desc: String,
    create_at: {
      type: Date,
      default: Date.now
    },
    update_at: {
      type: Date,
      default: Date.now
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'unit'
  }
);

UnitSchema.statics = {
  findById: id => this.findOne({ _id: id, deleted: false }),
  findByName: name => this.findOne({ name, deleted: false }),
  findAll: params => {
    const { page = 0, size = 10, search = '' } = params;
    // 在下面的代码中增加模糊搜索，和时间范围搜索
    const reg = new RegExp(search, 'i');
    return this.find({ deleted: false, name: { $regex: reg } })
      .sort({ update_at: -1 })
      .skip(page * size)
      .limit(size);
  }
};

module.exports = mongoose.model('Unit', UnitSchema);
