console.log('#model productCategory')
export default (mongoose)=>{
    const ProductCategorySchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        type: {
            type: String,
            default: "normal"
        },
        image: String,
        data: {},
        metatitle: {},
        metadescription: {},
        description: {},
        values:[],
    });
    return ProductCategorySchema

};