console.log('#model title');
export default (mongoose) => {
  const titleSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      number: { type: String, required: true, unique: true },
      description: { type: String },
    },
    { timestamps: true }
  );
  return titleSchema;
};
