'use strict';
const site_URL='http://localhost:3000'
const front_URL='http://localhost:3001'
// const site_URL='https://hypermyper.herokuapp.com'
// const front_URL='https://hypermyper-front.herokuapp.com'
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
const knex = require('knex');
const ZarinpalCheckout = require('zarinpal-checkout');
const { parse } = require('path');

var db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1223',
      database : 'postgres'
    }
  });
// var db = knex({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//     }
//   });

const app= express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// {}
app.use(cors());
app.options('*', cors());
// {}
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

// app.get('/',(req,res)=>{ res.send('Back-End Work')})
app.get('/datas/:id',(req,res)=>{
    const { id } = req.params;
    db.transaction(trx => {
        trx.select ('quantity_item','id_item').from ('orders_items')
        .where('id_orders_items', '=' ,id)
    .then(order=>{
        console.log(order.length)
       return order.map(o=>{
            console.log(o)
            return trx('items')
                .where('id', '=', o.id_item)
                .decrement('counter', o.quantity_item)
        })
    })  .then(trx.commit)
    .catch(trx.rollback);

   })
//    .catch(err=>err.code === '23505' ? res.json('emailexists')
//        : res.status(400).json(err)
//    )
    
    // db.select ('quantity_item','id_item').from ('orders_items').where('id_orders_items', '=' ,id)
    //     .then(data =>{
    //             res.send(data);})
})

app.get('/elements', function(req, res) {
    db.select().table('categores').where(req.query)
        .then (function(rows){
            var promises = rows.map(function(cateElement){
                return db.select().table('items').where('id_categores',cateElement.id)
                    .then(function(itemArr){
                        cateElement ['items'] =itemArr
                        return cateElement
                })
            })
        return Promise.all(promises)    
        }).then(function(elements){     
            res.json (elements);
        })
});
app.post('/setitemvisitp',function(req,res){
    db('items').where(req.query)
    .increment('visit', 1)
    .then(cc=>{
        res.json('item +1');
    })
});

app.get('/getcomnts', function(req, res) {
    db.select().table('comnt').where(req.query)  
        .then(function(elements){     
            res.json (elements);
        })
});

app.post('/signin',(req,res)=>{
    db.select('email','hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
          const isTrue = bcrypt.compareSync(req.body.password, data[0].hash)
          if(isTrue){
              return db.select('*').from('users')
                .where('email','=',req.body.email)
                .then(user => {
                    res.json(user[0])
                })
              .catch(err=> res.status(400).json('database'));
          }else{
              res.status(204).json('wrong pass')
          }
      })
      .catch(err =>res.status(404).json('wrong email'))
})
app.post('/signup',(req,res)=>{
    const {email,username,firstname,lastname,phone,password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
         trx.insert({
             hash: hash,
             email:email
         })
     .into('login')
     .returning('email')
     .then(loginEmail=>{
         return trx('users')
            .returning('*')
            .insert({
                    username: username,
                    firstname:firstname,
                    lastname:lastname,
                    email:  loginEmail[0],
                    phone: phone,
                    joined: new Date(),
                    valid:false
            })
            .then(user => {
                res.json(user[0]);
            })
        })
     .then(trx.commit)
     .catch(trx.rollback)
    })
    .catch(err=>err.code === '23505' ? res.json('emailexists')
        : res.status(400).json(err)
    )
})
app.post('/usercomment',(req,res)=>{
    db.select('id','username').from('users')
        .where('id', '=', req.body.id_users)
        .then(data => {
            const isTrue = req.body.usrname === data[0].username
            if(isTrue){
                return db('comnt').insert({
                    id_users: req.body.id_users,
                    id_items: req.body.id_items,
                    valid_comment: false,
                    usrcomment: req.body.usrcomment,
                    usrname: req.body.usrname
                }).then(comnts=>{
                    res.json('comment is saved');
                })
            }
        })
})

app.get('/profile/:id',(req,res) =>{
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user =>{
            if(user.length){
                res.json(user[0])
            }else{
                res.status(400).json('not found')
            }
        })
        .catch(err => res.json(400).json('error geting user'))
})
app.post('/orderCreate',(req,res)=>{
    const {total_items,id_user,staty,city,zipcode,callnum,addres,items} = req.body;
    db('orders').insert({
        total_items:total_items,
        id_user:id_user,
        staty:staty,
        city:city,
        zipcode:zipcode,
        callnum:callnum,
        addres:addres,
        items:items,
        isdate:new Date(),
        is_finaly:false
    }).returning('*')
    .then(order=>{
        res.json(order[0].id);
    }).catch(err=>res.json(err))
})
app.post('/orderItemCreate',(req,res)=>{
    const {id_orders_items,id_item,name_item,price_item,spichial_item,quantity_item,id_categores_item} = req.body;
    db('orders_items').insert({
        id_orders_items:id_orders_items,
        id_item:id_item,
        name_item:name_item,
        price_item:price_item,
        spichial_item:spichial_item,
        quantity_item:quantity_item,
        id_categores_item:id_categores_item,
    }).returning('*')
    .then(orderitem=>{
        res.json(orderitem[0].id_orders_items);
    })
    .catch(err=>res.json(err))
})
/**
 * Initial ZarinPal module.
 * @param {String} 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' [MerchantID]
 * @param {bool} false [toggle `Sandbox` mode]
 */
var zarinpal = ZarinpalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);

/**
 * Route: PaymentRequest [module]
 * @return {String} URL [Payement Authority]
 */
app.get('/PaymentRequest/:order_ID', function(req, res) {
    const { order_ID } = req.params;
    return db.select('*').from('orders').where('id','=',order_ID)
    .then(orderrow=>{
        zarinpal.PaymentRequest({
            Amount: orderrow[0].total_items,
            CallbackURL: site_URL+'/PaymentVerification/'+orderrow[0].id,/////////
            Description: `فروشگاه اینترنتی هایپر مایپر فاکتور شماره ${orderrow[0].id}`
        }).then(function (response) {
            if (response.status == 100) {
                return db('orders')
                .where('id','=' ,order_ID)
                .update('authority', response.authority)
                .then(r=>{
                    res.json(response)
                })
            }
        }).catch(function (err) {
            console.log(err);
        });
    })
	
});


/**
 * Route: PaymentVerification [module]
 * @return {number} RefID [Check Paymenet state]
 */
app.get('/PaymentVerification/:order_ID', function(req, res) {
    const { order_ID } = req.params
    // const Authority = req.query.Authority
    const Status = req.query.Status
    // console.log('parametrs in url',Authority,Status,order_ID)
    if(Status === 'OK'){
        return db.select('*').from('orders').where('id','=',order_ID)
        .then(orderrow=>{
            zarinpal.PaymentVerification({
            Amount: orderrow[0].total_items,
            Authority: orderrow[0].authority,
            }).then(function (response) {
                if (response.status == 101) {
                    return db('orders')
                    .where('id','=' ,order_ID)
                    .update('is_finaly', 'true').update('ref_id',response.RefID)
                    
                    .then(r=>{
                        res.redirect(url.format({
                            pathname:front_URL+'/profile',
                            query: {
                               "ordere": order_ID,
                               "sucss": true,
                               "ref": response.RefID,
                               "id_user":orderrow[0].id_user
                             }
                          }));
                        })
                } else if(response.status == 100) {
                    return db('orders')
                    .where('id','=' ,order_ID)
                    .update('is_finaly', 'true').update('ref_id',response.RefID)
                //     .then( db.transaction(trx => {
                //         trx.select ('quantity_item','id_item').from ('orders_items')
                //         .where('id_orders_items', '=' ,order_ID)
                //     .then(order=>{
                //        return order.map(o=>{
                //             return trx('items')
                //                 .returning('*')
                //                 .where('id', '=', o.id_item)
                //                 .decrement('counter', o.quantity_item)
                //         })
                //     })  .then(trx.commit)
                //     .catch(trx.rollback);
                
                //    }))
                    .then(r=>{
                        res.redirect(url.format({
                            pathname:front_URL+'/profile',
                            query: {
                               "ordere": order_ID,
                               "sucss": true,
                               "ref": response.RefID,
                               "id_user":orderrow[0].id_user
                             }
                          }));
                        })
                }else{
                    console.log(response);
                    res.redirect(url.format({
                        pathname:front_URL+'/profile',
                        query: {
                           "ordere": order_ID,
                           "sucss": false,
                           "ref": response.RefID,
                           "id_user":orderrow[0].id_user
                         }
                      }));
                }
            }).catch(function (err) {
                console.log(err);
            });
        })
    }else{
        return db.select('*').from('orders').where('id','=',order_ID)
        .then(orderrow=>{
            res.redirect(url.format({
                pathname:front_URL+'/profile',
                query: {
                "ordere": order_ID,
                "sucss": false,
                "ref": orderrow[0].authority,
                "id_user":orderrow[0].id_user
                }
            }))
        })
    }
});

app.get('/orederShow/:id_user', function(req, res) {
    db.select().table('users').where('id','=',req.params.id_user)
        .then (function(rows){
            var promises = rows.map(function(userElement){
                return db.select().table('orders').where('id_user',userElement.id)
                    .then(function(orderArr){
                        userElement ['orders'] =orderArr
                        return userElement
                })
            })
        return Promise.all(promises)    
        }).then(function(elements){     
            res.json (elements);
        })
});
/*/** */
app.get('/admino/users', function(req, res) {
    
    var req_sort=JSON.parse(req.query._sort)
    var req_range=JSON.parse(req.query.range)
    //filter
    db.select('*').from('users').orderBy(req_sort[0],req_sort[1]) 
         .then(function(elements){   
            res.set('contentRange','users'+' '+parseInt(req_range[0]+1)+'-'+parseInt(req_range[1]+1)+'/'+ parseInt(elements.length+1) ); 
            // res.set('contentRange', parseInt(elements.length+1) ); 
            res.json ( elements.slice(req_range[0], req_range[1]) );
         })
});
app.get('/admino/users/:users', function(req, res) {
    db.select('*').from('users').where('id','=',parseInt(req.params.users))
    .then(function(elements){
        res.json(elements[0])
    })
});
app.put('/admino/users/:users', async (req, res) => {
    var {email,username,firstname,lastname,phone,valid} = req.body;
    try {
      const count = await 
      db.select('*').from('users').where('id','=',parseInt(req.params.users)) .update({
                email: email,
                username: username,
                firstname:firstname,
                lastname:lastname,
                phone:phone,
                valid:valid
              })
      if (count) {
        res.status(200)
            db.select('*').from('users').where('id','=',parseInt(req.params.users))
            .then(function(elements){
                res.json(elements[0])
            })
        
      } else {
        res.status(404).json({message: "Record not found"})
      }
    } catch (err) {
      res.status(500).json({message: "Error updating ", error: err})
    }
  });

  ////////////////
  app.get('/admino/reviews', function(req, res) {
    
    var req_sort=JSON.parse(req.query._sort)
    var req_range=JSON.parse(req.query.range)
    //filter
    db.select('*').from('comnt').orderBy(req_sort[0],req_sort[1]) 
         .then(function(elements){   
            res.set('contentRange','reviews'+' '+req_range[0]+'-'+ req_range[1]+'/'+ elements.length ); 
            res.send ( elements.slice(req_range[0], req_range[1]) );
         })
});
app.get('/admino/reviews/:reviews', function(req, res) {
    db.select('*').from('comnt').where('id','=',parseInt(req.params.reviews))
    .then(function(elements){
        res.json(elements[0])
    })
});
app.put('/admino/reviews/:reviews', async (req, res) => {
    var {valid_comment} = req.body;
    try {
      const count = await 
      db.select('*').from('comnt').where('id','=',parseInt(req.params.reviews)) 
      .update({
                valid_comment:valid_comment,
              })
      if (count) {
        res.status(200)
            db.select('*').from('comnt').where('id','=',parseInt(req.params.reviews))
            .then(function(elements){
                res.json(elements[0])
            })
        
      } else {
        res.status(404).json({message: "Record not found"})
      }
    } catch (err) {
      res.status(500).json({message: "Error updating ", error: err})
    }
  });
/**///
app.get('/admino/orders', function(req, res) {
    
    var req_sort=JSON.parse(req.query._sort)
    var req_range=JSON.parse(req.query.range)
    //filter
    db.select('*').from('orders').orderBy(req_sort[0],req_sort[1]) 
         .then(function(elements){   
            res.set('contentRange','orders'+' '+req_range[0]+'-'+ req_range[1]+'/'+ elements.length ); 
            res.send ( elements.slice(req_range[0], req_range[1]) );
         })
});
app.get('/admino/orders/:orders', function(req, res) {
    db.select('*').from('orders').where('id','=',parseInt(req.params.orders))
    .then(function(elements){
        res.json(elements[0])
    })
});

app.listen(port,error=> {
    if(error) throw error;
    console.log(`app is run on: ${port}`)
})