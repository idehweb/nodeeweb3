export default (mongoose) =>
  new mongoose.Schema(
    {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      active: { type: Boolean, default: true },
      adscategory: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Adscategory" },
      ],
      attributes: [
        {
          attribute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attributes",
          },
          values: [],
        },
      ],

      price: Number,
      salePrice: Number,
      data: {},
      sku: String,
      excerpt: {},

      customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
      type: { type: String, default: "normal" },
      description: {},
      likes: [
        {
          customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
          userIp: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      views: [
        {
          customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
          userIp: String,
          type: {
            type: String,
            // [اگهی و شماره تلفن و تماس]
            enum: ["", "PHONE", "CALL"],
            default: "",
            required: true,
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      title: {},
      metatitle: {},
      metadescription: {},
      keywords: {},
      slug: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      thumbnail: String,
      status: { type: String, default: "processing" },
      transaction: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      ],
      photos: [],
      adNumber: Number,
    },
    { versionKey: false }
  );
