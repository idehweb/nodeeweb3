import _forEach from 'lodash/forEach.js';
import _get from 'lodash/get.js';
import path from 'path';
import mime from 'mime';
import fs from 'fs';
import { readFile } from 'fs/promises';
import https from 'https';
import requestIp from 'request-ip';
import { populateTitle } from './utils.js';
import * as XLSX from 'xlsx';
const { read, utils } = XLSX;
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
    let Initem = req.mongoose.model('Initem');
    if (req.headers.response !== 'json') return res.show();

    let sort = { in_stock: -1, updatedAt: -1 };

    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    let fields = '';
    if (req.headers && req.headers.fields) {
      fields = req.headers.fields;
    }

    let searchParams = null;
    let search = {
      sku: {
        $ne: '',
      },
    };

    if (req.query.filter) {
      let thef = '';

      const json = isStringified(req.query.filter);

      if (typeof json == 'object') {
        thef = JSON.parse(req.query.filter);
        if (thef.search) searchParams = thef.search;
      } else {
        console.log('string is not a valid json');
      }
    }
    if (req.params.search) searchParams = req.params.search;
    if (req.query.search) searchParams = req.query.search;
    if (req.query.Search) searchParams = req.query.Search;

    if (searchParams) {
      search['$or'] = [
        {
          ['title.' + req.headers.lan]: {
            $exists: true,
            $regex: searchParams,
            $options: 'i',
          },
        },
        {
          sku: {
            $exists: true,
            $regex: searchParams,
            $options: 'i',
          },
        },
      ];
    }

    if (req.query && req.query.status) {
      search.status = req.query.status;
    }

    let tt = Object.keys(req.query);

    _forEach(tt, (item) => {
      if (Initem.schema.paths[item]) {
        let split = req.query[item].split(',');
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      } else {
        // console.log("filter doesnot exist => ", item);
      }
    });
    let q;
    if (search['productCategory.slug']) {
      let ProductCategory = req.mongoose.model('ProductCategory');

      // console.log('search[\'productCategory.slug\']', search['productCategory.slug'])

      ProductCategory.findOne(
        { slug: search['productCategory.slug'] },
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
              ss['attributes.values'] = thef.device;
            }
            if (thef.brand) {
              ss['attributes.values'] = thef.brand;
            }
            Initem.find(ss, function (err, products) {
              Initem.countDocuments(ss, async function (err, count) {
                if (err || !count) {
                  res.json([]);
                  return 0;
                }
                res.setHeader('X-Total-Count', count);

                // populate
                await populateTitle(req.mongoose.model('title'), products);

                return res.json(products);
              });
            })
              .populate('productCategory', '_id slug')
              .skip(offset)
              .sort(sort)
              .limit(parseInt(req.params.limit));
          }
        }
      );
      // console.log('q', q)
    } else {
      console.log("search",search)
      q = Initem.find(search, fields)
        .skip(offset)
        .sort(sort)
        .limit(parseInt(req.params.limit));

      q.exec(function (err, model) {
        if (err || !model) return res.json([]);
        Initem.countDocuments(search, async function (err, count) {
          if (err || !count) {
            res.json([]);
            return 0;
          }
          // populate
          await populateTitle(req.mongoose.model('title'), model);

          res.setHeader('X-Total-Count', count);
          return res.json(model);
        });
      });
    }
  },
    exporter: function (req, res, next) {
    let Initem = req.mongoose.model('Initem');
    if (req.headers.response !== 'json') return res.show();

    let sort = { in_stock: -1, updatedAt: -1 };

    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    let fields = '';
    if (req.headers && req.headers.fields) {
      fields = req.headers.fields;
    }

    let searchParams = null;
    let search = {
      sku: {
        $ne: '',
      },
    };

    if (req.query.filter) {
      let thef = '';

      const json = isStringified(req.query.filter);

      if (typeof json == 'object') {
        thef = JSON.parse(req.query.filter);
        if (thef.search) searchParams = thef.search;
      } else {
        console.log('string is not a valid json');
      }
    }
    if (req.params.search) searchParams = req.params.search;
    if (req.query.search) searchParams = req.query.search;
    if (req.query.Search) searchParams = req.query.Search;

    if (searchParams) {
      search['$or'] = [
        {
          ['title.' + req.headers.lan]: {
            $exists: true,
            $regex: searchParams,
            $options: 'i',
          },
        },
        {
          sku: {
            $exists: true,
            $regex: searchParams,
            $options: 'i',
          },
        },
      ];
    }

    if (req.query && req.query.status) {
      search.status = req.query.status;
    }

    let tt = Object.keys(req.query);

    _forEach(tt, (item) => {
      if (Initem.schema.paths[item]) {
        let split = req.query[item].split(',');
        if (req.mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      } else {
        // console.log("filter doesnot exist => ", item);
      }
    });
    let q;
    console.log('we are herewe are here')
    if (search['productCategory.slug']) {
      let ProductCategory = req.mongoose.model('ProductCategory');

      // console.log('search[\'productCategory.slug\']', search['productCategory.slug'])

      ProductCategory.findOne(
        { slug: search['productCategory.slug'] },
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
              ss['attributes.values'] = thef.device;
            }
            if (thef.brand) {
              ss['attributes.values'] = thef.brand;
            }
            Initem.find(ss, function (err, products) {
              Initem.countDocuments(ss, async function (err, count) {
                if (err || !count) {
                  res.json([]);
                  return 0;
                }
                res.setHeader('X-Total-Count', count);

                // populate
                await populateTitle(req.mongoose.model('title'), products);

                return res.json(products);
              });
            })
              .populate('productCategory', '_id slug')
              .skip(offset)
              .sort(sort)
              .limit(parseInt(req.params.limit));
          }
        }
      );
      // console.log('q', q)
    } else {
      console.log('we are here')
      q = Initem.find(search, fields)
        .skip(offset)
        .sort(sort)
        .limit(parseInt(req.params.limit));

      q.exec(function (err, model) {
        if (err || !model) return res.json([]);
        Initem.countDocuments(search, async function (err, count) {
          if (err || !count) {
            res.json([]);
            return 0;
          }
          // populate
          await populateTitle(req.mongoose.model('title'), model);

          res.setHeader('X-Total-Count', count);


            // const url = "https://docs.sheetjs.com/executive.json";
            const raw_data = model;


            /* flatten objects */
            const rows = raw_data.map(row => ({
                title: row.title?.fa ,
                slug: row?.slug,
                sku: row?.sku,
                number: row?.data?.number,
                mojavez: (row?.data?.mojavez && row?.data?.mojavez[0]) ? row?.data?.mojavez.join(',') : "" ,
                group1: (row?.data?.group1) ? row?.data?.group1 : "" ,
                emkan: (row?.data?.emkan) ? row?.data?.emkan : "" ,
                importduty: (row?.data?.importduty) ? row?.data?.importduty : "" ,
                spec_title: row?.data?.spec_title?.title,
                spec_title_number: row?.data?.spec_title?.number,
            }));

            /* generate worksheet and workbook */
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

            /* fix headers */
            XLSX.utils.sheet_add_aoa(worksheet, [["title", "slug", "sku","number","mojavez","group1","emkan","importduty","spec_title","spec_title_number"]], { origin: "A1" });

            /* calculate column width */
            const max_width = rows.reduce((w, r) => Math.max(w, r.title.length), 10);
            worksheet["!cols"] = [ { wch: max_width } ];

            /* create an XLSX file and try to save to Presidents.xlsx */
            let name="initems-"+new Date().valueOf()+".xlsx";
            let x=XLSX.writeFile(workbook, "./public_media/exports/"+name, { compression: true });
            console.log('x',x)
             // return x;
            res.json({"url":"https://gomrok24.com/exports/"+name})
        });
      });
    }
  },

  createByAdmin: function (req, res, next) {
    let Initem = req.mongoose.model('Initem');
    if (!req.body) {
      req.body = {};
    }
    if (!req.body.type) {
      req.body.type = 'normal';
    }
    if (req.body && req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    }

    if (req.body.type == 'variable') {
      req.body.in_stock = false;
      if (req.body.combinations) {
        _forEach(req.body.combinations, (comb) => {
          if (comb.in_stock && comb.quantity != 0) {
            req.body.in_stock = true;
          }
        });
      }
    }
    if (req.body.type == 'normal') {
      // delete req.body.options;
      delete req.body.combinations;
    }
    Initem.create(req.body, function (err, product) {
      if (err || !product) {
        res.json({
          err: err,
          success: false,
          message: 'error!',
        });
        return 0;
      }

      if (req.headers._id && req.headers.token) {
        delete req.body.views;
        let action = {
          user: req.headers._id,
          title: 'create product ' + product._id,
          action: 'create-product',
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
    let Initem = req.mongoose.model('Initem');

    if (!req.params.id) {
      return res.json({
        success: false,
        message: 'send /edit/:id please, you did not enter id',
      });
    }
    if (!req.body) {
      req.body = {};
    }
    if (!req.body.type) {
      req.body.type = 'normal';
    }
    //export new object saved
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    }
    if (req.body.type == 'variable') {
      req.body.in_stock = false;
      if (req.body.combinations) {
        _forEach(req.body.combinations, (comb) => {
          if (comb.in_stock && comb.quantity != 0) {
            req.body.in_stock = true;
          }
        });
      }
    }
    if (req.body.type == 'normal') {
      delete req.body.options;
      delete req.body.combinations;
    }
    if (req.body.like) {
      // delete req.body.options;
      delete req.body.like;
    }
    if (!req.body.status || req.body.status == '') {
      // delete req.body.options;
      req.body.status = 'processings';
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
            message: 'error!',
            err: err,
          });
          return 0;
        }
        if (req.headers._id && req.headers.token) {
          delete req.body.views;
          // delete req.body.views;
          let action = {
            user: req.headers._id,
            title: 'edit product ' + product._id,
            action: 'edit-product',
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
    console.log('importFromLatest');
    let __dirname = path.resolve();
    let filePath = path.join(__dirname, './entity/initem/', 'tarefe.json');
    let Initem = req.mongoose.model('Initem');

    // console.log('filePath',filePath)
    let data = readFile(filePath, 'utf8').then((items) => {
      console.log('item', typeof items);
      _forEach(JSON.parse(items), (itm) => {
        Initem.create(
          {
            sku: itm.tarefe,
            slug: itm.tarefe,
            title: {
              fa: itm.title,
            },
            data: {
              number: itm.tarefe,
              importduty: itm.hogh,
            },
          },
          function (err, product) {
            console.log('err', err);

            console.log(product._id);
          }
        );
        // console.log(itm.title)
        // console.log(itm.hogh)
      });
    });
    // console.log('data', data)
  },
  importFromMojavez: function (req, res, next) {
    console.log('importFromMojavez');
    let __dirname = path.resolve();
    let filePath = path.join(__dirname, './entity/initem/', '23.json');
    let Initem = req.mongoose.model('Initem');

    // console.log('filePath',filePath)
    let data = readFile(filePath, 'utf8').then((items) => {
      console.log('item', typeof items);
      _forEach(JSON.parse(items), (itm) => {
        // console.log('itm',itm.tarefe)
        Initem.findOne(
          {
            sku: itm.tarefe,
          },
          function (err, product) {
            // console.log('err', err)
            if (product) {
              let d = product.data;
              d['mojavez'] = itm.mojavez;
              Initem.findByIdAndUpdate(
                product._id,
                {
                  $set: {
                    data: d,
                  },
                },
                function (err, productt) {
                  // console.log('err', err)
                  if (productt) {
                    console.log(productt._id);
                  }
                }
              );
            }
          }
        ).lean();
      });
    });
  },
  importFromOlaviat: function (req, res, next) {
    console.log('importFromOlaviat');
    let __dirname = path.resolve();
    let filePath = path.join(__dirname, './entity/initem/', '1.json');
    let Initem = req.mongoose.model('Initem');

    // console.log('filePath',filePath)
    let data = readFile(filePath, 'utf8').then((items) => {
      console.log('item', typeof items);
      _forEach(JSON.parse(items), (itm, j) => {
        if (j < 200000000) {
          console.log('itmitm', itm);
          let tarefe = itm.tarefe.toString();
          console.log('tarefe', tarefe);
          if (tarefe.length < 8) tarefe = '0' + tarefe;
          console.log('itm', tarefe, itm.group);
          Initem.findOne(
            {
              sku: tarefe,
            },
            function (err, product) {
              // console.log('err', err)
              if (product) {
                let d = product.data;
                d['group1'] = itm.group;
                d['emkan'] = itm.emkan;
                Initem.findByIdAndUpdate(
                  product._id,
                  {
                    $set: {
                      data: d,
                    },
                  },
                  function (err, productt) {
                    console.log('err', err);
                    if (productt) {
                      console.log(productt._id);
                    }
                  }
                );
              }
            }
          ).lean();
        }
      });
    });
  },

  rewriteItems: function (req, res, next) {
    let Initem = req.mongoose.model('Initem');
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
          obj['sku'] = '0' + item.sku;
          obj['slug'] = '0' + item.sku;
          console.log('obj', { $set: obj });
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

  rewriteProductsImages: function (req, res, next) {
    let Initem = req.mongoose.model('Initem');
    let Media = req.mongoose.model('Media');
    Initem.find({}, function (err, products) {
      _forEach(products, (item) => {
        // console.log('item', item.data.short_description)
        // console.log('item', item.data.sku)
        // console.log('item', item.data.regular_price)
        // console.log('item', item.data.sale_price)
        // console.log('item', item.data.total_sales)
        // console.log('item', item.data.images)
        let photos = [];
        if (item.photos) {
          _forEach(item.photos ? item.photos : [], async (c, cx) => {
            let mainUrl = encodeURI(c);
            // console.log('images[', cx, ']', mainUrl);

            let filename = c.split('/').pop(),
              __dirname = path.resolve(),
              // name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
              name = filename,
              type = path.extname(name),
              mimtype = mime.getType(type),
              filePath = path.join(__dirname, './public_media/customer/', name),
              fstream = fs.createWriteStream(filePath);
            // console.log('name', filename)
            // console.log('getting mainUrl', req.query.url + mainUrl);

            https.get(req.query.url + mainUrl, function (response) {
              response.pipe(fstream);
            });

            // console.log('cx', cx);

            fstream.on('close', function () {
              // console.log('images[' + cx + '] saved');
              let url = 'customer/' + name,
                obj = [{ name: name, url: url, type: mimtype }];
              // Media.create({
              //     name: obj[0].name,
              //     url: obj[0].url,
              //     type: obj[0].type
              //
              // }, function (err, media) {
              //     if (err) {
              //         // console.log({
              //         //     err: err,
              //         //     success: false,
              //         //     message: 'error'
              //         // })
              //     } else {
              // console.log(cx, ' imported');

              // photos.push(media.url);
              // if (photos.length == item.photos.length) {
              //     Initem.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
              //     })
              // }
              //     }
              // });
            });
          });
        } else {
        }
        // if (item.photos)
        //     Initem.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
        //     })
      });
    });
  },
  viewOne: function (req, res, next) {
    let Initem = req.mongoose.model('Initem');
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
      obj['_id'] = req.params.id;
    } else {
      obj['slug'] = req.params.id;
    }
    // console.log('get product: ', obj)
    Initem.findOne(obj, function (err, product) {
      if (err || !product) {
        res.json({
          success: false,
          message: 'error!',
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
    let Initem = req.mongoose.model('Initem');

    Initem.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: 'trash',
        },
      },
      function (err, product) {
        if (err || !product) {
          return res.json({
            success: false,
            message: 'error!',
          });
        }
        if (req.headers._id && req.headers.token) {
          let action = {
            user: req.headers._id,
            title: 'delete product ' + product._id,
            // data:order,
            action: 'delete-product',

            history: product,
            product: product._id,
          };
          req.submitAction(action);
        }
        return res.json({
          success: true,
          message: 'Deleted!',
        });
      }
    );
  },
};
