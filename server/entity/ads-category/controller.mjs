import _forEach from "lodash/forEach.js";

export default {
  getAll: function (req, res, next) {
    const AdsCategory = req.mongoose.model("Adscategory");

    let offset = 0;
    if (req.params.offset) offset = parseInt(req.params.offset);

    let search = {};
    AdsCategory.find(search, function (err, items) {
      if (err || !items)
        return res.json({
          success: false,
          message: "error",
        });

      AdsCategory.countDocuments({}, function (err, count) {
        if (err || !count) {
          res.setHeader("X-Total-Count", 0);

          return res.json({
            success: false,
            message: "error!",
          });
        }
        res.setHeader("X-Total-Count", count);
        return res.json(items);
      });
    })
      .skip(offset)
      .sort({ _id: -1 })
      .limit(req.params.limit);
  },
  level: function (req, res, next) {
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    let Adscategory = req.mongoose.model("Adscategory");

    let search = {};
    if (!req.params.catId) {
      search["parent"] = null;
    } else {
      search["parent"] = req.params.catId;
    }
    search["name." + req.headers.lan] = {
      $exists: true,
    };
    console.log(search);
    Adscategory.find(search, function (err, categorys) {
      if (err || !categorys) {
        res.json({
          success: false,
          message: "error!",
          err: err,
        });
        return 0;
      }
      Adscategory.countDocuments({}, function (err, count) {
        // console.log('countDocuments', count);
        if (err || !count) {
          res.json({
            err2: err,
            success: false,
            message: "error!",
          });
          return 0;
        }
        res.setHeader("X-Total-Count", count);
        _forEach(categorys, (c) => {
          c.name = c["name"][req.headers.lan];
          // console.log(c);
        });
        res.json(categorys);
        return 0;
      });
    });
    // .skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit));
  },

  createByAdmin: function (req, res, next) {
    let Adscategory = req.mongoose.model("Adscategory");
    if (!req.body) req.body = {};

    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }

    Adscategory.create(req.body, function (err, product) {
      if (err || !product) {
        res.json({
          err: err,
          success: false,
          message: "error!",
        });
        return 0;
      }

      if (req.headers._id && req.headers.token) {
        let action = {
          user: req.headers._id,
          title: "create Adscategory " + product._id,
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
    const Adscategory = req.mongoose.model("Adscategory");

    if (!req.params.id) {
      return res.json({
        success: false,
        message: "send /edit/:id please, you did not enter id",
      });
    }
    if (!req.body) req.body = {};

    //export new object saved
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }

    req.body.updatedAt = new Date();

    Adscategory.findByIdAndUpdate(
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
            title: "edit Adscategory " + product._id,
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

  viewOne: function (req, res, next) {
    const Adscategory = req.mongoose.model("Adscategory");
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

    Adscategory.findOne(obj, function (err, product) {
      if (err || !product) {
        res.json({
          success: false,
          message: "error!",
          err: err,
        });
        return 0;
      }

      res.json(product);
    }).lean();
  },
  destroy: function (req, res, next) {
    const Adscategory = req.mongoose.model("Adscategory");

    Adscategory.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        return res.json({
          success: false,
          message: "error!",
        });
      }
      if (req.headers._id && req.headers.token) {
        let action = {
          user: req.headers._id,
          title: "delete Adscategory " + req.params.id,
          // data:order,
          action: "delete-product",

          history: {},
          product: req.params.id,
        };
        req.submitAction(action);
      }
      return res.json({
        success: true,
        message: "Deleted!",
      });
    });
  },
};
