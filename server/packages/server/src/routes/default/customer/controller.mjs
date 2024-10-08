import persianJs from 'persianjs';
import _forEach from 'lodash/forEach.js';
import global from '#root/global';
import bcrypt from 'bcrypt';

const self = {
    createOne: async function (req, res, next) {
        let Customer = req.mongoose.model("Customer");
        let p_number = req?.body?.phoneNumber?.toString();
        req.body.countryCode = "98";
        if (p_number && p_number != "") {
            p_number = p_number.replace(/\s/g, '');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        }
        req.body.phoneNumber = parseInt(p_number).toString();

        let ctn = req?.body?.companyTelNumber?.toString();
        if (ctn && ctn != "") {
            ctn = ctn.replace(/\s/g, '');
            ctn = persianJs(ctn).arabicNumber().toString().trim();
            ctn = persianJs(ctn).persianNumber().toString().trim();
            ctn = parseInt(ctn);
            req.body.companyTelNumber = ctn;
            if (ctn.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (ctn.toString().length === 10) {
                    ctn = '98' + ctn.toString();
                }
            }
            console.log(ctn);

            if (isNaN(ctn)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        }
        req.body.companyTelNumber = parseInt(ctn).toString();
        let {companyTelNumber, phoneNumber} = req.body;
        if (phoneNumber == "NaN" || phoneNumber == '') {
            phoneNumber = "";
            delete req.body.phoneNumber
        }
        if (companyTelNumber == "NaN" || companyTelNumber == '') {
            companyTelNumber = "";
            delete req.body.companyTelNumber
        }
        console.log('here')
        try {
            let arr = [];
            if (!(companyTelNumber == '' || companyTelNumber == 'NaN')) {
                arr.push({companyTelNumber: {$regex: companyTelNumber, $options: 'i'}})
            }
            if (!(phoneNumber == '' || phoneNumber == 'NaN')) {
                arr.push({phoneNumber: {$regex: phoneNumber, $options: 'i'}})
            }
            const customers = await Customer.find({
                "$or": arr
            }, '_id phoneNumber companyTelNumber companyName firstName lastName');
            console.log('customers found', customers);
            if (customers && customers[0]) {
                res.json({
                    err: 'customer_exist',
                    success: false,
                    phoneNumber: phoneNumber,
                    companyTelNumber: companyTelNumber,
                    message: "this customer exist!",
                    customers: customers,
                    query: arr
                });
                return 0;
            }
            console.log('customers', customers)
            if (!customers || (customers && !customers[0])) {
                const customer = await Customer.create(req.body);
                console.log('create customer...', customer);
                if (!customer) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error!",
                    });
                    return 0;
                }

                res.json(customer);

                return 0;
            }
        } catch (e) {
            res.json({
                err: e,
                success: false,
                message: "catch!",
            });
            return 0;
        }

    },
    viewOne: function (req, res, next) {
        const Customer = req.mongoose.model('Customer');
        const Admin = req.mongoose.model('Admin');

        const obj = {};
        if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
        else obj.slug = req.params.id;

        if (!obj._id && !obj.slug)
            return res.status(404).json({
                success: false,
            });

        const q = Customer.findOne(obj, {
            password: 0,
            tokens: 0,
        })
            .populate({
                path: 'status.user',
                select: '_id nickname firstName lastName username',
                modal: 'Admin',
            })
            .lean();

        q.exec(function (err, item) {
            if (err)
                return res.status(503).json({
                    success: false,
                    message: 'error!',
                    err: err,
                });

            if (!item) return res.status(404).json({success: false});

            res.json(item);
        });
    },
    allCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        let Order = req.mongoose.model('Order');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields;
        }
        let search = {};
        if (req.params.search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.params.search,
                $options: 'i',
            };
        }
        if (req.query.search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.query.search,
                $options: 'i',
            };
        }
        if (req.query.Search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.query.Search,
                $options: 'i',
            };
        }

        let thef = req.query;

        if (
            thef.firstName ||
            thef.lastName ||
            thef.phoneNumber ||
            thef.internationalCode ||
            thef.companyTelNumber ||
            thef.campaign ||
            thef.companyName
        ) {
            search = {$or: []};
        }
        if (thef.firstName) {
            search['$or'].push({
                firstName: {$regex: thef.firstName, $options: 'i'},
            });
        }
        if (thef.lastName) {
            search['$or'].push({
                lastName: {$regex: thef.lastName, $options: 'i'},
            });
        }
        if (thef.phoneNumber) {
            search['$or'].push({
                phoneNumber: {$regex: thef.phoneNumber, $options: 'i'},
            });
        }
        if (thef.internationalCode) {
            search['$or'].push({
                internationalCode: {$regex: thef.internationalCode, $options: 'i'},
            });
        }
        if (thef.companyName) {
            search['$or'].push({
                companyName: {$regex: thef.companyName, $options: 'i'},
            });
        }
        if (thef.companyTelNumber) {
            search['$or'].push({
                companyTelNumber: {$regex: thef.companyTelNumber, $options: 'i'},
            });
        }
        if (thef.campaign) {
            search = {"campaign": {"$elemMatch": {_id: thef.campaign, "status": "visited"}}};

        }
        if (thef && thef.status) {
            search = {
                status: thef.status,
            };
        }
        if (search.status) {
            console.log('search.status:', search)

            const response = Customer.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{$last: '$status.status'}, search.status],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        internationalCode: 1,
                        active: 1,
                        source: 1,
                        email: 1,
                        phoneNumber: 1,
                        activationCode: 1,
                        credit: 1,
                        customerGroup: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        status: 1,
                        companyTelNumber: 1,
                        companyName: 1,
                    },
                },
                {
                    $facet: {
                        items: [
                            {
                                $sort: {
                                    createdAt: -1,

                                    updatedAt: -1,
                                    _id: -1,
                                },
                            },
                            {$skip: offset},
                            {$limit: parseInt(req.params.limit)},
                        ],
                        count: [{$count: 'count'}],
                    },
                },
            ]).exec();

            //TODO
            response
                .then((result) => {
                    const customers = result[0].items;
                    const count = result[0].count[0].count;

                    if (!customers) {
                        console.log('err', err);
                        res.json([]);
                        return 0;
                    }
                    let thelength = customers.length,
                        p = 0;

                    res.setHeader('X-Total-Count', count);
                    _forEach(customers, (item, i) => {
                        if (item._id) {
                            let sObj = {customer: item._id};

                            Order.countDocuments(sObj, function (err, theOrderCount) {
                                customers[i].orderCount = theOrderCount;
                                p++;
                                if (p == thelength) {
                                    return res.json(customers);
                                    // 0;
                                }
                            });
                        } else {
                            p++;
                        }
                        if (p == thelength) {
                            return res.json(customers);
                            // 0;
                        }
                    });

                    // })
                })
                .catch((err) => {
                    return res.json([]);
                });
        } else {
            console.log('customer search:', JSON.stringify(search))
            Customer.find(
                search,
                '_id , firstName , lastName , internationalCode , active , source , email , phoneNumber , activationCode , credit , customerGroup  , createdAt , updatedAt , status , companyTelNumber , companyName',
                function (err, customers) {
                    if (err || !customers) {
                        console.log('err', err);
                        res.json([]);
                        return 0;
                    }
                    let thelength = customers.length,
                        p = 0;
                    // delete search['$or'];
                    Customer.countDocuments(search, function (err, count) {
                        if (err || !count) {
                            res.json([]);
                            return 0;
                        }
                        res.setHeader('X-Total-Count', count);
                        _forEach(customers, (item, i) => {
                            if (item._id) {
                                let sObj = {customer: item._id};
                                //
                                // if (req.query['date_gte']) {
                                //
                                //     sObj['createdAt'] = {$lt: new Date(req.query['date_gte'])};
                                // }
                                // if(search['status']){
                                //     sObj['status']=search['status'];
                                // }

                                Order.countDocuments(sObj, function (err, theOrderCount) {
                                    customers[i].orderCount = theOrderCount;
                                    p++;
                                    if (p == thelength) {
                                        return res.json(customers);
                                        // 0;
                                    }
                                });
                            } else {
                                p++;
                            }
                            if (p == thelength) {
                                return res.json(customers);
                                // 0;
                            }
                        });
                    });
                }
            )
                .skip(offset)
                .sort({
                    createdAt: -1,

                    updatedAt: -1,
                    _id: -1,
                })
                .limit(parseInt(req.params.limit))
                .lean();
        }
    },
    getme: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        if (req.headers._id)
            Customer.findById(
                req.headers._id,
                '_id email nickname firstName lastName data phoneNumber internationalCode address',
                function (err, customer) {
                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        return res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    }

                    return res.json({
                        success: true,
                        customer: customer,
                    });
                }
            );
        else
            res.json({
                success: false,
            });
    },

    authCustomer: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        console.log('\n\n\n\n\n =====> try login/register user:');
        // let self=this;
        let p_number = req.body.phoneNumber.toString();
        let fd = req.body.countryCode.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        console.log('phone number:', NUMBER);
        Customer.findOne({phoneNumber: NUMBER}, function (err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err,
                });
                return 0;
                // reject(err);
            }
            if (response) {
                let obj = {
                    success: response.success,
                    _id: response._id,
                };
                console.log('user was in db before...');
                self.updateActivationCode(obj, res, req, true);
            } else {
                console.log('user was not in db before...');

                //we should create customer
                let objs = req.body;
                objs.phoneNumber = NUMBER;
                Customer.create(
                    {
                        phoneNumber: NUMBER,
                        invitation_code: req.body.invitation_code,
                    },
                    function (err, response) {
                        if (err) {
                            if (parseInt(err.code) == 11000) {
                                Customer.findOne(
                                    {phoneNumber: NUMBER},
                                    function (err3, response) {
                                        if (err3) {
                                            res.json({
                                                success: false,
                                                message: 'error!',
                                                err: err,
                                            });
                                        }
                                        // console.log('registering user...')
                                        self.updateActivationCode(response, res, req);
                                    }
                                );
                            } else {
                                res.json({
                                    success: false,
                                    message: 'error!',
                                    err: err,
                                });
                            }
                        } else {
                            // console.log('==> sending sms');
                            let $text;
                            $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
                            // console.log($text);
                            // if (req.body.invitation_code) {
                            //     self.addToInvitaitionList(response._id, req.body.invitation_code);
                            // }

                            // global.sendSms('9120539945', $text, '300088103373', null, '98').then(function (uid) {
                            //     // console.log('==> sending sms to admin ...');
                            //     let objd = {};
                            //     objd.message = $text;
                            //     global.notifateToTelegram(objd).then(function (f) {
                            //         // console.log('f', f);
                            //     });
                            // }).catch(function () {
                            //     return res.json({
                            //         success: true,
                            //         message: 'Sth wrong happened!'
                            //     });
                            // });
                            self.updateActivationCode(response, res, req);
                        }
                    }
                );
            }
        });
    },
    updateActivationCode: function (
        response,
        res,
        req,
        userWasInDbBefore = false
    ) {
        console.log('\n\n\n\n\n =====> updateActivationCode');
        let Customer = req.mongoose.model('Customer');
        let Settings = req.mongoose.model('Settings');

        // console.log('==> updateActivationCode');
        // console.log(response);
        Settings.findOne({}, 'passwordAuthentication', function (err, setting) {
            let passwordAuthentication = false;
            if (setting?.passwordAuthentication)
                passwordAuthentication = true;
            console.log("passwordAuthentication",passwordAuthentication)
            let code = Math.floor(100000 + Math.random() * 900000);
            let date = new Date();
            Customer.findByIdAndUpdate(
                response._id,
                {
                    activationCode: code,
                    updatedAt: date,
                },
                {new: true},
                function (err, post) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'error!',
                        });
                    } else {
                        let shallWeSetPass = true;
                        if (post.password) {
                            shallWeSetPass = false;
                        }
                        if(!passwordAuthentication){
                            shallWeSetPass = false;

                        }
                        res.json({
                            success: true,
                            message: 'Code has been set!',
                            userWasInDbBefore: userWasInDbBefore,
                            shallWeSetPass: shallWeSetPass,
                        });
                        console.log('==> sending sms');
                        let $text;
                        $text = 'فروشگاه آنلاین آروند' + ' : ' + post.activationCode;
                        console.log('req.body.method', req.body.method);
                        console.log('activation code is:', post.activationCode);

                        if (!shallWeSetPass && userWasInDbBefore) {
                            console.log(
                                'shallWeSetPass && userWasInDbBefore:',
                                shallWeSetPass,
                                userWasInDbBefore
                            );

                            return;
                        }
                        if (req.body.method == 'whatsapp') {
                            Customer.findByIdAndUpdate(
                                response._id,
                                {
                                    whatsapp: true,
                                },
                                {new: true},
                                function (err, cus) {
                                    return;
                                }
                            );
                        } else {
                            let key = 'sms_welcome';
                            if (userWasInDbBefore) {
                                key = 'sms_register';
                            }
                            console.log('...global.sendSms');
                            global
                                .sendSms(
                                    req.body.phoneNumber,
                                    [
                                        {
                                            key: 'activationCode',
                                            value: post.activationCode,
                                        },
                                    ],
                                    '300088103373',
                                    response._id,
                                    req.body.countryCode,
                                    key
                                )
                                .then(function (uid) {
                                    console.log(
                                        'activation code sent via sms to customer:',
                                        req.body.phoneNumber
                                    );
                                    return;
                                })
                                .catch(function (e) {
                                    console.log('sth is wrong', e);
                                    return;
                                });
                        }
                    }
                }
            );
        })
    },
    activateCustomer: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        let Settings = req.mongoose.model('Settings');

        // console.log('==> updateActivationCode');
        // console.log(response);
        Settings.findOne({}, 'passwordAuthentication', function (err, setting) {
            let passwordAuthentication = false;
            if (setting?.passwordAuthentication)
                passwordAuthentication = true;
            console.log("passwordAuthentication", passwordAuthentication)

            console.log('activateCustomer...');
            let p_number = req.body.phoneNumber;
            if (p_number) {
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                if (p_number.toString().length < 12) {
                    // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                    if (p_number.toString().length === 10) {
                        p_number = '98' + p_number.toString();
                    }
                }
                // console.log('==> addCustomer() 1.15');
                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message:
                        'something wrong in creating customer : phoneNumber is not entered!',
                });
                return;
            }
            req.body.phoneNumber = p_number.toString();
            // console.log('customer phone number is:', p_number.toString());

            p_number = req.body.activationCode;
            if (p_number) {
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                // console.log('==> addCustomer() 1.15');
                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message:
                        'something wrong in creating customer : activationCode is not entered!',
                });
                return;
            }
            req.body.activationCode = p_number.toString();
            // console.log('activationCode is:', p_number.toString());
            // parseInt(p_number).toString()

            Customer.findOne(
                {phoneNumber: req.body.phoneNumber},
                '_id activationCode internationalCode address firstName lastName invitation_code',
                function (err, user) {
                    if (err) return next(err);
                    // console.log('user is:', user);
                    if (user) {
                        // console.log('==> check db.activationCode with req.body.activationCode');
                        // console.log(user.activationCode, req.body.activationCode);
                        if (user.activationCode == req.body.activationCode) {
                            let Token = global.generateUnid();
                            let invitation_code;
                            if (!user.invitation_code) {
                                invitation_code = Math.floor(100000 + Math.random() * 900000);
                            } else {
                                invitation_code = user.invitation_code;
                            }
                            console.log('Token generated:', Token);
                            Customer.findByIdAndUpdate(
                                user._id,
                                {
                                    activationCode: null,
                                    invitation_code: invitation_code,
                                    $push: {tokens: {token: Token, os: req.body.os}},
                                },
                                {
                                    returnNewDocument: true,
                                    projection: {
                                        password: true,
                                        // internationalCode:true,
                                        // address:true,
                                        // firstName:true,
                                        // lastName:true
                                    },
                                },
                                function (err, post) {
                                    if (err) return next(err);
                                    // console.log('user activated successfully...');
                                    // if (post.tokens)
                                    // console.log('user tokens count is:', post.tokens.length);
                                    let shallWeSetPass = true;
                                    if (post.password) {
                                        shallWeSetPass = false;
                                    }
                                    if(!passwordAuthentication){
                                        shallWeSetPass = false;

                                    }
                                    console.log("set shallWeSetPass",shallWeSetPass)
                                    return res.json({
                                        success: true,
                                        token: Token,
                                        address: user.address,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        internationalCode: user.internationalCode,
                                        shallWeSetPass: shallWeSetPass,
                                        invitation_code: invitation_code,
                                        _id: user._id,
                                        message: 'Your user account activated successfully!',
                                    });
                                }
                            );
                        } else {
                            return res.json({
                                success: false,
                                message: 'The code is wrong!',
                            });
                        }
                    } else {
                        return res.json({
                            success: false,
                            message: 'This user was not found!',
                        });
                    }
                }
            );
        });
    },
    authCustomerWithPassword: function (req, res, next) {
        // console.log('\n\n\n\n\n =====> try login/register user:');
        // let self=this;
        let Customer = req.mongoose.model('Customer');

        let p_number = req.body.phoneNumber.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            // console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        // console.log('this is phone number:', NUMBER);
        Customer.authenticate(NUMBER, req.body.password, function (error, cus) {
            if (error || !cus) {
                let err = new Error('Wrong phoneNumber or password.');
                err.status = 401;
                res.status(401);
                return res.json({
                    success: false,
                    message: 'شماره موبایل یا رمز عبور اشتباه!',
                });
            } else {
                // req.session.userId = user._id;

                return res.json({
                    success: true,
                    message: 'در حال ریدایرکت...',
                    customer: cus,
                });
            }
        });
    },
    authCustomerForgotPass: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        console.log('\n\n\n\n\n =====> Customer Forgot Password:');
        // let self=this;
        let p_number = req.body.phoneNumber.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            // if (p_number.toString().length < 12) {
            //     console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
            //     if (p_number.toString().length === 10) {
            //         p_number = "98" + p_number.toString();
            //     }
            // }
            // console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        console.log('this phone number:', NUMBER);
        Customer.findOne({phoneNumber: NUMBER}, function (err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err,
                });
                return 0;
                // reject(err);
            }
            if (response) {
                let obj = {
                    success: response.success,
                    _id: response._id,
                };
                // console.log('user was in db before...');
                Customer.findOneAndUpdate(
                    {phoneNumber: NUMBER},
                    {password: ''},
                    function (err, response) {
                        self.updateActivationCode(obj, res, req, true);
                    }
                );
            } else {
                //we should create customer
                let objs = req.body;
                objs.phoneNumber = NUMBER;
                Customer.create(
                    {
                        phoneNumber: NUMBER,
                        invitation_code: req.body.invitation_code,
                    },
                    function (err, response) {
                        if (err) {
                            if (parseInt(err.code) == 11000) {
                                Customer.findOne(
                                    {phoneNumber: NUMBER},
                                    function (err3, response) {
                                        if (err3) {
                                            res.json({
                                                success: false,
                                                message: 'error!',
                                                err: err,
                                            });
                                        }
                                        // console.log('registering user...')
                                        self.updateActivationCode(response, res, req);
                                    }
                                );
                            } else {
                                res.json({
                                    success: false,
                                    message: 'error!',
                                    err: err,
                                });
                            }
                        } else {
                            // console.log('==> sending sms');
                            let $text;
                            $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
                            // console.log($text);
                            if (req.body.invitation_code) {
                                self.addToInvitaitionList(
                                    response._id,
                                    req.body.invitation_code
                                );
                            }

                            // global.sendSms('9120539945', $text).then(function (uid) {
                            //     // console.log('==> sending sms to admin ...');
                            //     let objd = {};
                            //     objd.message = $text;
                            //     global.notifateToTelegram(objd).then(function (f) {
                            //         console.log('f', f);
                            //     });
                            // }).catch(function () {
                            //     return res.json({
                            //         success: true,
                            //         message: 'Sth wrong happened!'
                            //     });
                            // });
                            self.updateActivationCode(response, res, req);
                        }
                    }
                );
            }
        });
    },
    setPassword: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        // console.log('\n\n\n\n\n =====> try to set password:');
        console.log('before hash');
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            // console.log('after hash');
            req.body.password = hash;
            let obj = {
                password: req.body.password,
            };
            if (req.body.email) {
                obj['email'] = req.body.email;
            }
            if (req.body.nickname) {
                obj['nickname'] = req.body.nickname;
            }
            if (req.body.firstName) {
                obj['firstName'] = req.body.firstName;
            }
            if (req.body.lastName) {
                obj['lastName'] = req.body.lastName;
            }
            if (req.body.internationalCode) {
                obj['internationalCode'] = req.body.internationalCode;
            }
            console.log('obj', obj);
            Customer.findOneAndUpdate(
                {
                    _id: req.headers._id,
                },
                obj,

                {
                    new: true,
                    projection: {
                        _id: 1,
                        email: 1,
                        nickname: 1,
                        firstName: 1,
                        lastName: 1,
                        internationalCode: 1,
                        address: 1,
                    },
                },
                function (err, customer) {
                    // console.log('==> pushSalonPhotos() got response');

                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        return res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    }

                    return res.json({
                        success: true,
                        customer: customer,
                    });
                }
            );
        });
    },
    setPasswordWithPhoneNumber: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        // console.log('\n\n\n\n\n =====> try to set password with phone number:');
        // console.log('before hash');
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            // console.log('after hash');
            req.body.password = hash;
            let obj = {
                password: req.body.password,
            };
            if (req.body.email) {
                obj['email'] = req.body.email;
            }
            if (req.body.nickname) {
                obj['nickname'] = req.body.nickname;
            } else {
                if (req.body.firstName && req.body.lastName) {
                    obj['nickname'] = req.body.firstName + ' ' + req.body.lastName;
                }
            }
            if (req.body.firstName) {
                obj['firstName'] = req.body.firstName;
            }
            if (req.body.lastname) {
                obj['lastName'] = req.body.lastName;
            }
            let p_number = req.body.phoneNumber.toString();
            if (p_number) {
                p_number = p_number.replace(/\s/g, '');
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                // console.log('==> addCustomer() 1.15');
                req.body.phoneNumber = p_number;
                if (p_number.toString().length < 12) {
                    // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                    if (p_number.toString().length === 10) {
                        p_number = '98' + p_number.toString();
                    }
                }
                // console.log(p_number);

                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : phoneNumber is not entered!',
                });
                return;
            }
            let NUMBER = parseInt(p_number).toString();

            // console.log('this is phone number:', NUMBER);
            Customer.findOneAndUpdate(
                {
                    phoneNumber: NUMBER,
                },
                obj,
                {
                    new: true,
                    projection: {
                        _id: 1,
                        email: 1,
                        nickname: 1,
                        firstName: 1,
                        lastName: 1,
                        tokens: 1,
                        address: 1,
                        internationalCode: 1,
                    },
                },
                function (err, customer) {
                    // console.log('==> pushSalonPhotos() got response');

                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    } else {
                        self.getToken(customer, res);

                        // res.json({
                        //     success: true,
                        //     customer: customer
                        //
                        // })
                    }
                }
            );
        });
    },
    rewriteCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        Customer.find({}, function (err, respo) {
            _forEach(respo, (c) => {
                // console.log('get phoneNumber', c.phoneNumber)
                if (c.phoneNumber.length < 12) {
                    Customer.findByIdAndDelete(c._id, function (err, it) {
                        console.log('delete it', it._id);
                    });
                }
                if (c.phoneNumber.length == 12) {
                    if (!c.lastName && c.firstName) {
                        let obj = {};
                        let las = c.firstName.split(' ');
                        let fi = las.shift();
                        obj['firstName'] = fi;
                        if (obj['firstName'] == 'سید') {
                            let tt = las.shift();
                            obj['firstName'] = obj['firstName'] + ' ' + tt;
                        }
                        obj['lastName'] = las.join(' ', ' ');
                        Customer.findByIdAndUpdate(
                            c._id,
                            obj,
                            function (err, responses) {
                            }
                        );
                    }
                }
            });
        });
    },
    removeDuplicatesCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        Customer.find({}, function (err, respo) {
            _forEach(respo, (cus) => {
                console.log('get phoneNumber', cus.phoneNumber);
                Customer.find(
                    {phoneNumber: cus.phoneNumber},
                    function (err, responses) {
                        if (responses && responses.length > 1) {
                            let mainCust = responses[0];
                            let IDSToDELETE = [];
                            _forEach(responses, (theOtherCustomer, j) => {
                                if (j != 0) IDSToDELETE.push(theOtherCustomer._id);
                                if (theOtherCustomer.sex) {
                                    mainCust.sex = theOtherCustomer.sex;
                                }
                                if (theOtherCustomer.email) {
                                    mainCust.email = theOtherCustomer.email;
                                }
                            });
                            Customer.findByIdAndUpdate(mainCust._id, mainCust);
                            // Customer.deleteMany({_id: {$in: IDSToDELETE}})
                            IDSToDELETE.map(async (id) => {
                                console.log('delete id:', id);

                                await Customer.findByIdAndDelete(id);
                            });
                        }
                    }
                );
            });
        });
    },
    status: function (req, res, next) {
        // console.clear();
        req.body.updatedAt = new Date();
        let Customer = req.mongoose.model('Customer');

        Customer.findByIdAndUpdate(
            req.params._id,
            {
                $push: {
                    status: {
                        user: req.headers._id,
                        status: req.body.status,
                        description: req.body.description,
                        createdAt: new Date(),
                    },
                },
            },
            function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!',
                    });
                    return 0;
                }

                res.json({
                    success: true,
                    post: post,
                });
            }
        );
    },

    updateAddress: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        console.log('\n\n\n\n\n =====> editing updateAddress:');
        let search = {
            $or: [
                {email: {$regex: req.body.email, $options: 'i'}},
                {phoneNumber: {$regex: req.body.phoneNumber, $options: 'i'}},
            ],
        };
        Customer.findOne(
            {_id: req.headers._id},
            '_id , phoneNumber , email , address',
            function (err, respo) {
                if (err) {
                    res.json({
                        success: false,
                        err: err,
                        message: 'خطا در ثبت اطلاعات!',
                    });
                    return;
                }
                // console.log('respo:', respo);
                let c = false;
                if (!respo) {
                    c = true;
                } else {
                    if (respo._id.toString() === req.headers._id.toString()) {
                        c = true;
                    } else {
                        res.json({
                            success: false,
                            message: 'ایمیل یا نام کاربری از قبل وجود دارد!',
                        });
                        return;
                    }
                }
                if (c) {
                    Customer.findByIdAndUpdate(
                        req.headers._id,
                        {
                            address: req.body.address,
                            updatedAt: new Date(),
                        },
                        {
                            new: true,
                            projection: {
                                _id: 1,
                                address: 1,
                            },
                        },
                        function (err, post) {
                            if (err || !post) {
                                res.json({
                                    err: err,
                                    address: req.body.address,
                                    success: false,
                                    message: 'findByIdAndUpdate update error!',
                                });
                                return;
                            }
                            // console.log('customer updated successfully!');
                            res.json({
                                success: true,
                                customer: post,
                            });
                            return;
                        }
                    );
                }
            }
        );
    },
    updateCustomer: function (req, res, next) {
        const Customer = req.mongoose.model('Customer');

        if (!req.headers._id) return res.status(403).json({success: false});

        const query = {
            $or: [
                {email: req.body.email},
                {internationalCode: req.body.internationalCode},
            ],
            _id: {$ne: req.headers._id},
        };

        Customer.findOne(
            query,
            '_id email internationalCode',
            function (err, respo) {
                if (err)
                    return res.status(503).json({
                        success: false,
                        message: 'error!',
                        err: err,
                    });

                if (respo)
                    return res.status(400).json({
                        success: false,
                        message: 'ایمیل یا کد ملی از قبل وجود دارد!',
                    });

                Customer.findByIdAndUpdate(
                    req.headers._id,
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        internationalCode: req.body.internationalCode,
                        updatedAt: new Date(),
                    },
                    {new: true},
                    function (err, item) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: 'error!',
                                err: err,
                            });
                        if (!item) return res.status(404).json({success: false});

                        return res.json({
                            success: true,
                            customer: item,
                        });
                    }
                );
            }
        );
    },
};

export default self;
