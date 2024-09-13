import _forEach from "lodash/forEach.js";
import _get from "lodash/get.js";

import path from "path";
import mime from "mime";
import fs from "fs";
import https from "https";
import requestIp from "request-ip";

const logger = (type = "log", ...arg) => console[type]("[ADS]: => ", ...arg);

function isStringified(jsonValue) {
  // use this function to check
  try {
    return JSON.parse(jsonValue);
  } catch (err) {
    return jsonValue;
  }
}

// return these fields
const ViewObj = {
  _id: 1,
  active: 1,
  type: 1,
  description: 1,
  title: 1,
  slug: 1,
  status: 1,
  photos: 1,
  adNumber: 1,
  createdAt: 1,
  updatedAt: 1,
  attributes: 1,
  excerpt: 1,
  metadescription: 1,
  metatitle: 1,
  // views: 1,
  viewCount: {
    $cond: {
      if: { $isArray: "$views" },
      then: { $size: "$views" },
      else: 0,
    },
  },
  likeCount: {
    $cond: {
      if: { $isArray: "$likes" },
      then: { $size: "$likes" },
      else: 0,
    },
  },
};

export default {
  myAds: function (req, res, next) {
    const Add = req.mongoose.model("Add");

    let offset = 0;
    if (req.params.offset) offset = parseInt(req.params.offset);

    let search = {};
    search["customer"] = req.headers._id;
    Add.find(search, "", function (err, items) {
      if (err || !items) return res.json([]);

      Add.countDocuments(search, function (err, count) {
        if (err || !count) {
          res.setHeader("X-Total-Count", 0);
          return res.json([]);
        }
        res.setHeader("X-Total-Count", count);
        return res.json(items);
      });
    })
      .skip(offset)
      .sort({ _id: -1 })
      .limit(parseInt(req.params.limit))
      .lean();
  },
  createByCustomer: function (req, res, next) {
    let Add = req.mongoose.model("Add");
    if (req.headers._id && req.headers.token) {
      let action = {
        customer: req.headers._id,
        title: "create ad " + req.body.amount,
        data: req.body,
        // history:req.body,
        // order: order._id
      };
    }
    function convertToSlug(titleStr) {
      titleStr = titleStr.replace(/^\s+|\s+$/g, "");
      titleStr = titleStr.toLowerCase();
      //persian support
      titleStr = titleStr
        .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, "")
        // Collapse whitespace and replace by -
        .replace(/\s+/g, "-")
        // Collapse dashes
        .replace(/-+/g, "-");
      return titleStr;
    }
    function unicId(t) {
      let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
      var token = "";
      for (let i = 0; i < 6; i++) {
        token += abc[Math.floor(Math.random() * abc.length)];
      }

      return token; //Will return a 32 bit "hash"

      // return randtoken.generate(32);
    }
    let payload = {
      customer: req.headers._id,
      title: { fa: req.body.title },
      description: { fa: req.body.description },
      adscategory: [req.body.category],
      slug: convertToSlug(req.body.title) + "-" + unicId(),
      adNumber: Math.floor(10000 + Math.random() * 90000),
      photos: req.body.photos || [],
    };

    // payload['slug']=convertToSlug(req.body.title);

    Add.create(payload, function (err, order) {
      if (err || !order) {
        return res.json({
          err: err,
          success: false,
          message: "error!",
        });
      }
      if (req.headers._id && req.headers.token) {
        let action = {
          customer: req.headers._id,
          title: "create ads successfully " + order._id,
          data: req.body,
          history: req.body,
          order: order._id,
        };
        // req.global.submitAction(action);
      }

      req.fireEvent("create-ads-by-customer", order);
      res.json({ success: true, ad: order });
    });
  },

  getAllAdmin: function (req, res, next) {
    const Add = req.mongoose.model("Add");
    if (req.headers.response !== "json") {
      return res.show();
    }
    let sort = { updatedAt: -1 };
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
        logger("log", "string is not a valid json");
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
      ];
    }

    if (req.query && req.query.status) {
      search = { ...search, status: req.query.status };
    }

    let tt = Object.keys(req.query);
    _forEach(tt, (item) => {
      if (Add.schema.paths[item]) {
        let split = req.query[item].split(",");
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      }
    });

    let q;
    if (search["adscategory.slug"]) {
      let ProductCategory = req.mongoose.model("Adscategory");

      ProductCategory.findOne(
        { slug: search["adscategory.slug"] },
        function (err, productcategory) {
          if (err || !productcategory) return res.json([]);
          if (productcategory._id) {
            let ss = { adscategory: productcategory._id };
            if (thef.device) {
              ss["attributes.values"] = thef.device;
            }
            if (thef.brand) {
              ss["attributes.values"] = thef.brand;
            }

            Add.find(ss, function (err, products) {
              Add.countDocuments(ss, function (err, count) {
                if (err || !count) {
                  res.json([]);
                  return 0;
                }
                res.setHeader("X-Total-Count", count);
                return res.json(products);
              });
            })
              .populate("adscategory", "_id slug")
              .skip(offset)
              .sort(sort)
              .limit(parseInt(req.params.limit));
          }
        }
      );
    } else {
      q = Add.find(search, ViewObj)
        .populate("adscategory", "_id slug name")
        .populate("customer", "_id firstName lastName phoneNumber")
        .skip(offset)
        .sort(sort)
        .limit(parseInt(req.params.limit))
        .lean();

      q.exec(function (err, model) {
        if (err || !model) return res.json([]);
        Add.countDocuments(search, function (err, count) {
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
  getAll: function (req, res, next) {
    const Add = req.mongoose.model("Add");

    const sort = { updatedAt: -1 };
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
        search.adscategory_slug = thef.adscategory_slug || undefined;
      } else {
        logger("log", "string is not a valid json");
      }
    }
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
      ];
    }

    if (req.query && req.query.status) {
      search = { ...search, status: req.query.status };
    }

    let tt = Object.keys(req.query);

    _forEach(tt, (item) => {
      if (Add.schema.paths[item]) {
        let split = req.query[item].split(",");
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      }
    });

    if (search["adscategory_slug"]) {
      req.mongoose
        .model("Adscategory")
        .findOne(
          { slug: search["adscategory_slug"] },
          function (err, productcategory) {
            if (err || !productcategory) return res.json([]);
            const tempSearch = { status: "published" };

            if (productcategory._id)
              tempSearch.adscategory = productcategory._id;

            Add.find(tempSearch, function (err, model) {
              Add.countDocuments(tempSearch, function (err, count) {
                if (err || !count) {
                  res.setHeader("X-Total-Count", 0);
                  return res.json([]);
                }
                res.setHeader("X-Total-Count", count);
                return res.json(model);
              });
            })
              .populate("adscategory", "_id slug name")
              .skip(offset)
              .sort(sort)
              .limit(parseInt(req.params.limit));
          }
        );
    } else if (search.user_id) {
      req.mongoose
        .model("Customer")
        .findOne({ _id: search.user_id }, function (err, productcategory) {
          if (err || !productcategory) return res.json([]);
          const tempSearch = { status: "published" };

          Add.find(tempSearch, function (err, model) {
            Add.countDocuments(tempSearch, function (err, count) {
              if (err || !count) {
                res.setHeader("X-Total-Count", 0);
                return res.json([]);
              }
              res.setHeader("X-Total-Count", count);
              return res.json(model);
            });
          })
            .populate("adscategory", "_id slug name")
            .skip(offset)
            .sort(sort)
            .limit(parseInt(req.params.limit));
        });
    } else {
      if (!search["status"]) search["status"] = "published";

      const q = Add.find(search, fields)
        .populate("adscategory", "_id slug name")
        .skip(offset)
        .sort(sort)
        .limit(parseInt(req.params.limit));

      q.exec(function (err, model) {
        if (err || !model) return res.json([]);
        Add.countDocuments(search, function (err, count) {
          if (err || !count) {
            res.setHeader("X-Total-Count", 0);
            return res.json([]);
          }
          res.setHeader("X-Total-Count", count);
          return res.json(model);
        });
      });
    }
  },

  createByAdmin: function (req, res, next) {
    let Add = req.mongoose.model("Add");
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
    Add.create(req.body, function (err, product) {
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
    const Add = req.mongoose.model("Add");

    if (!req.params.id)
      return res.json({
        success: false,
        message: "send /edit/:id please, you did not enter id",
      });

    if (!req.body) req.body = {};

    if (!req.body.type) req.body.type = "normal";

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
    if (req.body.likes) {
      // delete req.body.options;
      delete req.body.likes;
    }
    if (!req.body.status || req.body.status == "") {
      // delete req.body.options;
      req.body.status = "processings";
    }
    req.body.updatedAt = new Date();

    Add.findByIdAndUpdate(
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

  fileUpload: function (req, res, next) {
    if (req.busboy) {
      req.pipe(req.busboy);

      req.busboy.on(
        "file",
        function (fieldname, file, filename, encoding, mimetype) {
          let fstream;
          const __dirname = path.resolve();

          let name = (
            req.global.getFormattedTime() + filename.filename
          ).replace(/\s/g, "");
          let Media = req.mongoose.model("Media");

          let filePath = path.join(__dirname, "./public_media/customer/", name);

          fstream = fs.createWriteStream(filePath);

          file.pipe(fstream);
          fstream.on("close", function () {
            let url = "customer/" + name;
            let obj = [{ name: name, url: url, type: mimetype }];
            req.photo_all = obj;
            let photos = obj;
            if (photos && photos[0]) {
              Media.create(
                {
                  name: photos[0].name,
                  url: photos[0].url,
                  type: photos[0].type,
                },
                function (err, media) {
                  if (err && !media) {
                    res.json({
                      err: err,
                      success: false,
                      message: "error",
                    });
                  }
                  res.json({
                    success: true,
                    media: media,
                  });
                }
              );
            } else {
              res.json({
                success: false,
                message: "upload faild!",
              });
            }
          });
        }
      );
    } else {
      next();
    }
  },

  viewOne: function (req, res, next) {
    const Add = req.mongoose.model("Add");

    const obj = {};
    if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
    else obj.slug = req.params.id;

    if (!obj._id && !obj.slug)
      return res.status(404).json({
        success: false,
      });

    const q = Add.findOne(obj, ViewObj)
      // 3 level of categories
      .populate({
        path: "adscategory",
        select: "_id slug name parent",
        populate: {
          path: "parent",
          select: "_id slug name parent",
          populate: {
            path: "parent",
            select: "_id slug name parent",
          },
        },
      })
      .populate("customer", "_id firstName lastName phoneNumber")
      .lean();

    q.exec(function (err, item) {
      if (err)
        return res.status(503).json({
          success: false,
          message: "error!",
          err: err,
        });

      if (!item) return res.status(404).json({ success: false });

      // TODO: exclude admin from views
      // if not admin then
      const isAdmin = false;
      if (!isAdmin)
        Add.findByIdAndUpdate(
          item._id,
          {
            $push: {
              views: {
                customer: req.headers._id,
                type: "",
                userIp: requestIp.getClientIp(req),
                createdAt: new Date(),
              },
            },
          },
          function (err, updatedProduct) {}
        );

      if (item && item.customer && item.customer.phoneNumber) {
        item.customer.phoneNumber = "+" + item.customer.phoneNumber;
      }
      res.json(item);
    });
  },
  destroy: function (req, res, next) {
    let Add = req.mongoose.model("Add");
    Add.findByIdAndDelete(req.params.id, function (err, product) {
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
    });
    // Add.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $set: {
    //       status: "trash",
    //     },
    //   },
    //   function (err, product) {
    //     if (err || !product) {
    //       return res.json({
    //         success: false,
    //         message: "error!",
    //       });
    //     }
    //     if (req.headers._id && req.headers.token) {
    //       let action = {
    //         user: req.headers._id,
    //         title: "delete product " + product._id,
    //         // data:order,
    //         action: "delete-product",
    //
    //         history: product,
    //         product: product._id,
    //       };
    //       req.submitAction(action);
    //     }
    //     return res.json({
    //       success: true,
    //       message: "Deleted!",
    //     });
    //   }
    // );
  },
  viewAd: function (req, res, next) {
    const Add = req.mongoose.model("Add");
    const obj = {};
    if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
    if (!obj._id)
      return res.status(404).json({
        success: false,
      });
    if (!["PHONE", "CALL"].includes(req.body.type))
      return res.status(400).json({
        success: false,
      });

    const q = Add.findOne(obj, { views: 1 }).lean();
    q.exec(function (err, item) {
      if (err)
        return res.status(503).json({
          success: false,
          message: "error!",
          err: err,
        });

      if (!item) return res.status(404).json({ success: false });

      Add.findByIdAndUpdate(
        item._id,
        {
          $push: {
            views: {
              customer: req.headers._id || null,
              type: req.body.type,
              userIp: requestIp.getClientIp(req),
              createdAt: new Date(),
            },
          },
        },
        function (err, updatedProduct) {
          if (err) logger("error", err);
        }
      );

      return res.status(204).json({
        success: true,
        message: "success",
      });
    });
  },
  getView: function (req, res, next) {
    const Add = req.mongoose.model("Add");

    const obj = {};
    if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
    if (!obj._id)
      return res.status(404).json({
        success: false,
      });

    const q = Add.findOne(obj, {
      views: {
        createdAt: 1,
        type: 1,
      },
    }).lean();

    q.exec(function (err, item) {
      if (err)
        return res.status(503).json({
          success: false,
          message: "error!",
          err: err,
        });
      if (!item) return res.status(404).json({ success: false });

      res.json(item);
    });
  },
};
