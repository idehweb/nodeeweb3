import _forEach from "lodash/forEach.js";
import path from "path";
import mime from "mime";
import fs from "fs";
import { readFile } from "fs/promises";
import https from "https";
import requestIp from "request-ip";

function isStringified(jsonValue) {
  // use this function to check
  try {
    // console.log("need to parse");
    return JSON.parse(jsonValue);
  } catch (err) {
    // console.log("not need o parse");

    return jsonValue;
  }
}

export default {
  getAll: function (req, res, next) {
    let Initem = req.mongoose.model("Tsc");
    if (req.headers.response !== "json") return res.show();

    let sort = { in_stock: -1, updatedAt: -1 };

    let offset = 0;
    if (req.params.offset) offset = parseInt(req.params.offset);

    let fields = "";
    if (req.headers && req.headers.fields) fields = req.headers.fields;

    let searchParams = null;
    let search = {};
    if (req.query.filter) {
      let thef = "";

      const json = isStringified(req.query.filter);

      if (typeof json == "object") {
        thef = JSON.parse(req.query.filter);
        if (thef.search) searchParams = thef.search;
      } else {
        console.log("string is not a valid json");
      }
    }

    if (req.params.search) searchParams = req.params.search;
    if (req.query.search) searchParams = req.query.search;
    if (req.query.Search) searchParams = req.query.Search;

    if (searchParams) {
      search["$or"] = [
        {
          ["title." + req.headers.lan]: {
            $exists: true,
            $regex: searchParams,
            $options: "i",
          },
        },
        {
          sku: {
            $exists: true,
            $regex: searchParams,
            $options: "i",
          },
        },
        {
          "data.brand": {
            $exists: true,
            $regex: searchParams,
            $options: "i",
          },
        },
        {
          "data.model": {
            $exists: true,
            $regex: searchParams,
            $options: "i",
          },
        },
      ];
    }

    if (req.query && req.query.status)
      search = { ...search, status: req.query.status };

    let tt = Object.keys(req.query);

    _forEach(tt, (item) => {
      // console.log("item => ",item);
      if (Initem.schema.paths[item]) {
        // console.log("item exists ====>> ",item);
        // console.log("instance of item ===> ",Initem.schema.paths[item].instance);
        let split = req.query[item].split(",");
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      } else {
      }
    });

    let q;
    if (search["productCategory.slug"]) {
      const ProductCategory = req.mongoose.model("ProductCategory");
      ProductCategory.findOne(
        { slug: search["productCategory.slug"] },
        function (err, productcategory) {
          // console.log('err', err)
          // console.log('req', productcategory)
          if (err || !productcategory) return res.json([]);
          if (productcategory._id) {
            // console.log({productCategory: {
            //         $in:[productcategory._id]
            //     }})
            let ss = { productCategory: productcategory._id };
            if (thef.device) {
              ss["attributes.values"] = thef.device;
            }
            if (thef.brand) {
              ss["attributes.values"] = thef.brand;
            }
            Initem.find(ss, function (err, products) {
              Initem.countDocuments(ss, function (err, count) {
                if (err || !count) {
                  res.json([]);
                  return 0;
                }
                res.setHeader("X-Total-Count", count);
                return res.json(products);
              });
            })
              .populate("productCategory", "_id slug")
              .skip(offset)
              .sort(sort)
              .limit(parseInt(req.params.limit));
          }
        }
      );
      // console.log('q', q)
    } else {
      console.log("search q.exec", search);

      q = Initem.find(search, fields)
        .populate("productCategory", "_id slug")
        .skip(offset)
        .sort(sort)
        .limit(parseInt(req.params.limit));

      q.exec(function (err, model) {
        if (err || !model) return res.json([]);
        Initem.countDocuments(search, function (err, count) {
          if (err || !count) {
            res.json([]);
            return 0;
          }
          res.setHeader("X-Total-Count", count);
          return res.json(model);
        });
      });
    }
  },

  createByAdmin: function (req, res, next) {
    let Initem = req.mongoose.model("Initem");
    if (!req.body) {
      req.body = {};
    }
    if (!req.body.type) {
      req.body.type = "normal";
    }
    if (req.body && req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }

    if (req.body.type == "variable") {
      req.body.in_stock = false;
      if (req.body.combinations) {
        _forEach(req.body.combinations, (comb) => {
          if (comb.in_stock && comb.quantity != 0) {
            req.body.in_stock = true;
          }
        });
      }
    }
    if (req.body.type == "normal") {
      // delete req.body.options;
      delete req.body.combinations;
    }
    Initem.create(req.body, function (err, product) {
      if (err || !product) {
        res.json({
          err: err,
          success: false,
          message: "error!",
        });
        return 0;
      }

      if (req.headers._id && req.headers.token) {
        delete req.body.views;
        let action = {
          user: req.headers._id,
          title: "create product " + product._id,
          action: "create-product",
          data: product,
          history: req.body,
          product: product._id,
        };
        req.submitAction(action);
      }
      res.json(product);
      return 0;
    });
  },

  editByAdmin: function (req, res, next) {
    let Initem = req.mongoose.model("Initem");

    if (!req.params.id) {
      return res.json({
        success: false,
        message: "send /edit/:id please, you did not enter id",
      });
    }
    if (!req.body) {
      req.body = {};
    }
    if (!req.body.type) {
      req.body.type = "normal";
    }
    //export new object saved
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }
    if (req.body.type == "variable") {
      req.body.in_stock = false;
      if (req.body.combinations) {
        _forEach(req.body.combinations, (comb) => {
          if (comb.in_stock && comb.quantity != 0) {
            req.body.in_stock = true;
          }
        });
      }
    }
    if (req.body.type == "normal") {
      delete req.body.options;
      delete req.body.combinations;
    }
    if (req.body.like) {
      // delete req.body.options;
      delete req.body.like;
    }
    if (!req.body.status || req.body.status == "") {
      // delete req.body.options;
      req.body.status = "processings";
    }
    req.body.updatedAt = new Date();

    Initem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, product) {
        if (err || !product) {
          res.json({
            success: false,
            message: "error!",
            err: err,
          });
          return 0;
        }
        if (req.headers._id && req.headers.token) {
          delete req.body.views;
          // delete req.body.views;
          let action = {
            user: req.headers._id,
            title: "edit product " + product._id,
            action: "edit-product",
            data: product,
            history: req.body,
            product: product._id,
          };
          req.submitAction(action);
        }

        res.json(product);
        return 0;
      }
    );
  },
  importFromLatest: function (req, res, next) {
    console.log("importFromLatest");
    let __dirname = path.resolve();
    let filePath = path.join(__dirname, "./entity/tsc/", "part6.json");
    let Initem = req.mongoose.model("Tsc");

    // console.log('filePath',filePath)
    let data = readFile(filePath, "utf8").then((items) => {
      console.log("item", typeof items);
      _forEach(JSON.parse(items), (itm, i) => {
        Initem.create(
          {
            sku: itm["tarefe"],
            slug: itm["tarefe"] + "_" + i + "_part6",
            title: {
              fa: itm["description"],
            },
            data: {
              country: itm["Country"],
              tarefe: itm["tarefe"],
              shenase: itm["shenase"],
              customsValue: itm["customsValue"],
              brand: itm["brand"],
              model: itm["model"],
              unit: itm["unit"],
              type: itm["type"],
              entryFeePercentage: itm["entryFeePercentage"],
            },
          },
          function (err, product) {
            console.log("err", err);

            console.log(product._id);
          }
        );
        // console.log(itm.title)
        // console.log(itm.hogh)
      });
    });
    // console.log('data', data)
  },
  rewriteItems: function (req, res, next) {
    let Initem = req.mongoose.model("Initem");
    let p = 0;
    // let Media = req.mongoose.model('Media');
    Initem.find({}, function (err, products) {
      _forEach(products, (item) => {
        let obj = {};
        if (
          item.sku &&
          item.sku.length &&
          item.sku.length < 8 &&
          item.sku.length > 6
        ) {
          // console.log('item.sku', item.sku,item.sku.length);
          obj["sku"] = "0" + item.sku;
          obj["slug"] = "0" + item.sku;
          console.log("obj", { $set: obj });
          Initem.findByIdAndUpdate(item._id, obj, function (err, pro) {
            p++;
            // console.log('p: ', p, ' products.length:', pro._id)
            if (p == products.length) {
              return res.json({
                success: true,
              });
            }
          });
        }

        // }
      });
    });
  },
  viewOne: function (req, res, next) {
    let Initem = req.mongoose.model("Initem");
    const ObjectId = req.mongoose.Types.ObjectId;

    // Validator function
    function isValidObjectId(id) {
      if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
      }
      return false;
    }

    let obj = {};
    // console.log('req.params.id', req.params.id)
    if (isValidObjectId(req.params.id)) {
      obj["_id"] = req.params.id;
    } else {
      obj["slug"] = req.params.id;
    }
    // console.log('get product: ', obj)
    Initem.findOne(obj, function (err, product) {
      if (err || !product) {
        res.json({
          success: false,
          message: "error!",
          err: err,
        });
        return 0;
      }

      let views = product.views;
      if (!views) {
        views = [];
      }

      views.push({
        userIp: requestIp.getClientIp(req),
        createdAt: new Date(),
      });
      Initem.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            // getContactData: product.getContactData,
            views: views,
          },
        },
        {
          fields: { _id: 1 },
        },
        function (err, updatedProduct) {}
      );
      // delete product.views;
      if (product.views) {
        product.views = product.views.length;
      } else {
        product.views = 0;
      }
      if (product.like) {
        product.like = product.like.length;
      } else {
        product.like = 0;
      }
      delete product.getContactData;
      delete product.transaction;
      delete product.relatedProducts;
      delete product.firstCategory;
      // Initem.findOne({_id: {$lt: req.params.id}}, "_id title", function (err, pl) {
      //     if (pl && pl._id && pl.title)
      //         product.nextProduct = {_id: pl._id, title: pl.title[req.headers.lan]};
      //     res.json(product);
      //     return 0;
      // }).sort({_id: 1}).limit(1);

      res.json(product);
    }).lean();
  },
  destroy: function (req, res, next) {
    let Initem = req.mongoose.model("Initem");

    Initem.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "trash",
        },
      },
      function (err, product) {
        if (err || !product) {
          return res.json({
            success: false,
            message: "error!",
          });
        }
        if (req.headers._id && req.headers.token) {
          let action = {
            user: req.headers._id,
            title: "delete product " + product._id,
            // data:order,
            action: "delete-product",

            history: product,
            product: product._id,
          };
          req.submitAction(action);
        }
        return res.json({
          success: true,
          message: "Deleted!",
        });
      }
    );
  },
};
