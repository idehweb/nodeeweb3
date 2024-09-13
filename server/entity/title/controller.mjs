import _ from 'lodash';

let self = {
  getAll: function (req, res, next) {
    let Item = req.mongoose.model('title');
    if (req.headers.response !== 'json') {
      return res.show();
    }
    let sort = { number: -1 };

    console.log('getAll()');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    let fields = 'title number updatedAt';
    if (req.headers && req.headers.fields) {
      fields = req.headers.fields;
    }
    let search = {};
    if (req.params.search) {
      search['$or'] = [
        {
          title: {
            $exists: true,
            $regex: req.params.search,
            $options: 'i',
          },
        },
        {
          number: {
            $exists: true,
            $regex: req.params.search,
            $options: 'i',
          },
        },
      ];
    }
    if (req.query.search) {
      search['$or'] = [
        {
          title: {
            $exists: true,
            $regex: req.query.search,
            $options: 'i',
          },
        },
        {
          number: {
            $exists: true,
            $regex: req.query.search,
            $options: 'i',
          },
        },
      ];
    }
    if (req.query.Search) {
      search['$or'] = [
        {
          title: {
            $exists: true,
            $regex: req.query.Search,
            $options: 'i',
          },
        },
        {
          number: {
            $exists: true,
            $regex: req.query.Search,
            $options: 'i',
          },
        },
      ];
    }
    if (req.query && req.query.status) {
      search = { ...search, status: req.query.status };
    }

    let tt = Object.keys(req.query);
    _.forEach(tt, (item) => {
      if (Item.schema.paths[item]) {
        let split = req.query[item].split(',');
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      } else {
      }
    });
    let thef = '';

    function isStringified(jsonValue) {
      try {
        return JSON.parse(jsonValue);
      } catch (err) {
        return jsonValue;
      }
    }

    if (req.query.filter) {
      const json = isStringified(req.query.filter);

      if (typeof json == 'object') {
        // console.log("string is a valid json");
        thef = JSON.parse(req.query.filter);
        if (thef.search) {
          console.log('thef.search', thef.search);
          // thef["title." + req.headers.lan] = {
          //   $exists: true,
          //   "$regex": thef.search,
          //   "$options": "i"
          // };
          thef['$or'] = [
            {
              title: {
                $exists: true,
                $regex: thef.search,
                $options: 'i',
              },
            },
            {
              number: {
                $exists: true,
                $regex: thef.search,
                $options: 'i',
              },
            },
          ];
          delete thef.search;
        }
      } else {
        console.log('string is not a valid json');
      }
      // if (JSON.parse(req.query.filter)) {
      //     thef = JSON.parse(req.query.filter);
      // }
    }
    // console.log('thef', thef);
    if (thef && thef != '') search = thef;
    // console.log(req.mongoose.Schema(Item))
    var q;
    console.log('search q.exec', search);
    q = Item.find(search, fields)
      .skip(offset)
      .sort(sort)
      .limit(parseInt(req.params.limit));
    q.exec(function (err, model) {
      if (err || !model) return res.json([]);
      Item.countDocuments(search, function (err, count) {
        if (err || !count) {
          res.json([]);
          return 0;
        }
        res.setHeader('X-Total-Count', count);
        return res.json(model);
      });
    });
  },
  viewOne: function (req, res, next) {
    console.log('----- viewOne -----');
    let obj = {};
    if (req.mongoose.isValidObjectId(req.params._slug)) {
      obj['_id'] = req.params._slug;
    } else {
      obj['number'] = req.params._slug;
    }
    if (req.mongoose.isValidObjectId(req.params.id)) {
      obj['_id'] = req.params.id;
      delete obj['number'];
    } else {
      obj['number'] = req.params.id;
    }
    let Product = req.mongoose.model('title');

    Product.findOne(
      obj,
      'title description number updatedAt',
      function (err, product) {
        if (err || !product) {
          res.json({ status: 'error', error: err });
          return 0;
        }

        let obj = {
          _id: product._id,
          title: product.title,
          description: product.description,
          number: product.number,
          updatedAt: product.updatedAt,
        };
        res.json(obj);
        return 0;
      }
    ).lean();
  },
};
export default self;
