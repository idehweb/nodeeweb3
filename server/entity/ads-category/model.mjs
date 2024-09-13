export default (mongoose) =>
  new mongoose.Schema(
    {
      name: {},
      nameForAdd: {},
      description: {},
      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      image: String,
      data: {},
      order: Number,
      active: Boolean,
      metatitle: {},
      metadescription: {},
      parent: { type: mongoose.Schema.Types.ObjectId, ref: "Adscategory" }, //category_id
    },
    { versionKey: false }
  );
