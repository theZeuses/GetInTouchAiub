const { static, urlencoded } = require('express');
const fs = require('fs');
const express 	= require('express');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const AdminModel = require.main.require('./models/Admin/adminModel');
const accContModel = require.main.require('./models/Admin/accContModel');
const contentcontModel = require.main.require('./models/Admin/contentcontModel');
const userModel = require.main.require('./models/Admin/userModel');
const GuserModel = require.main.require('./models/Admin/GeneraluserModel');
const postreqModel = require.main.require('./models/Admin/postReq');
const regreqModel = require.main.require('./models/Admin/regreqModel');
const post = require.main.require('./models/Admin/post');
const router 	= express.Router();


const storage = multer.diskStorage({
	//destination for files
	destination: function (request, file, callback) {
	  callback(null, './assets/pictures/');
	},
  
	//add back the extension
	filename: function (request, file, callback) {
	  callback(null, Date.now() + file.originalname);
	},
  });
  
  //upload parameters for multer
  const upload = multer({
	storage: storage,
	limits: {
	  fieldSize: 1024 * 1024 * 3,
	},
  });

router.get('/', (req, res)=>{
	
	if(req.cookies['uname'] != null && req.session.type=="Admin"){
		
		post.getAllpost(function(results){
			res.render('Adminhome/HomeAdmin',{post:results});
		});
		
	}else{
		res.redirect('/login');
	}
})




/////// Admin

router.get('/AdminList', (req, res)=>{
	//res.render('Adminhome/ContentContList');
	AdminModel.getAllAdmin(function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
				res.render('Adminhome/AdminList', {userlist: results});
					
		}else{
			res.redirect('/login');
		}
		
	});
   
   })
   router.get('/Adminprofile', (req, res)=>{
	
	   AdminModel.getByIdAdmin(req.cookies['uname'],function(results){
		   //console.log(results)
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/AdminProfile', {userlist: results});
				
	}else{
		res.redirect('/login');
	}
		   
		   
	   });
   
   })
   router.get('/editAccount', (req, res)=>{
	   AdminModel.getByIdAdmin(req.cookies['uname'],function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/EditAd', {userlist: results});
				
	}else{
		res.redirect('/login');
	}
		   
	   });
   
   })
   router.post('/editAccount', /* upload.single('image')*/ [

	
	
	check('name','please insert the name')
	
	.notEmpty()
	.withMessage('fild Must be filled up ')
	.isLength({min:5})
	.withMessage('Must be contain atleast 5 charecter'),
	check('email','invalid email')
	.isEmail()
	.normalizeEmail(),
	
	check('dob','invalid dob')
	.notEmpty(),
	check('address','invalid address')
	
	
	
	   ],(req, res)=>{
	   admin={
		   //img:req.file.filename,
		   adminid: req.body.username,
		   name:req.body.name,
		   email: req.body.email,
		   gender:req.body.gender,
		   dob: req.body.dob,
		   address:req.body.address,
	   }
	   const errors =validationResult(req)
	   {
		   if (!errors.isEmpty())
		   {
			AdminModel.getByIdAdmin(req.cookies['uname'],function(results){
			 //return res.status(422).jsonp(errors.array())
			 const alert =errors.array();
			 res.render('Adminhome/EditAd',{al:alert,userlist: results})
			})
		   }
		   else {
			AdminModel.updateAdmin(admin,function(results){
		
				res.redirect('/Adminhome/Adminprofile');
			});
		}
	   }

})
router .get('/SearchAdminlist/:data',(req,res)=>{

	if(req.params.data != null){
		var data = JSON.parse(req.params.data);
		//console.log(data);
		if(data.key.length == 0){
			AdminModel.getAllAdmin(function(results){
			
					res.json({result: results});
				
			});
		}else{
			AdminModel.GetAllAdminbykey(data.key, function(results){
					res.json({result: results});
				
			});
		}
	}
 
})

    
/////Account Controller
router.get('/AccountControllerList', (req, res)=>{
	
	accContModel.getAllActiveAccCont(function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/AccContList', {userlist: results});
				
	}else{
		res.redirect('/login');
	}
		 
	   });
   
   })

  

   router.get('/BlockAccCont/:id', (req, res)=>{
	AC ={
		id: req.params.id	
	};

	accContModel.BlockAC( AC,function(results){
		if(results){
			userModel.BlockUser( AC,function(result){
			if(result){
				res.redirect('/Adminhome/AccountControllerList');
			}
			})
		}
		  
	   });
   
   })

   router.get('/deleteAccCont/:id', (req, res)=>{
	users ={
		id: req.params.id	
	};
	accContModel.DeleteAccCont(users ,function(results){
		if (results)
		{
			userModel.deleteUser(users ,function(result){
				if (result)
				{
					res.redirect('/Adminhome/AccountControllerList');
				}			  
			});
		}		  
	   });
	})
   

	router.get('/unBlockAccCont/:id', (req, res)=>{
		AC ={
			id: req.params.id	
		};
	
		accContModel.unBlockAC( AC,function(results){
			if(results){
				userModel.unBlockUser( AC,function(result){
				if(result){
					res.redirect('/Adminhome/Blocklist');
				}
				})
			}
		   });
	   
	   })
	   router .get('/Searchaclist/:data',(req,res)=>{

		if(req.params.data != null){
			var data = JSON.parse(req.params.data);
			console.log(data);
			if(data.key.length == 0){
				accContModel.getAllActiveAccCont(function(results){
				
						res.json({result: results});
					
				});
			}else{
				accContModel.GetAllACbykey(data.key, function(results){
						res.json({result: results});
					
				});
			}
		}
	 
	})
 
///////Content Controller 

   router.get('/ContentControllerList', (req, res)=>{
	//res.render('Adminhome/ContentContList');
	contentcontModel.getAllActiveContentCont(function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/ContentContList', {userlist: results});
				
	}else{
		res.redirect('/login');
	}
		
	});
   
   })

   router.get('/deleteContentCont/:id', (req, res)=>{
	users ={
		id: req.params.id	
	};
	contentcontModel.DeleteContentCont(users ,function(results){
		if (results)
		{
			userModel.deleteUser(users ,function(result){
				if (result)
				{
					res.redirect('/Adminhome/ContentControllerList');
				}				  
			 });
		}		  
	   }); 
   })

   router.get('/BlockContentCont/:id', (req, res)=>{
	CC ={
		id: req.params.id	
	};

	contentcontModel.BlockCC( CC,function(results){
		if(results){
			userModel.BlockUser( CC,function(result){
			if(result){
				res.redirect('/Adminhome/ContentControllerList');
			}
			})
		}
	   });
   
   })
   router.get('/unBlockAccCont/:id', (req, res)=>{
	CC ={
		id: req.params.id	
	};

	contentcontModel.unBlockCC( CC,function(results){
		if(results){
			userModel.unBlockUser( CC,function(result){
			if(result){
				res.redirect('/Adminhome/Blocklist');
			}
			})
		}
	   });
   
   })
   router .get('/Searchcclist/:data',(req,res)=>{

	if(req.params.data != null){
		var data = JSON.parse(req.params.data);
		console.log(data);
		if(data.key.length == 0){
			contentcontModel.getAllActiveContentCont(function(results){
			
					res.json({result: results});
				
			});
		}else{
			contentcontModel.GetAllCCbykey(data.key, function(results){
					res.json({result: results});
				
			});
		}
	}
 
})

   /////////////General User

   router.get('/deleteuser/:id', (req, res)=>{	
	users ={
		id: req.params.id	
	};
	GuserModel.deleteUser(users ,function(results){
		if (results)
		{
			userModel.deleteUser(users ,function(status){
				if (status)
				{
					res.redirect('/Adminhome/userlist');
				}				  
			   });		
		}		  
	   });
	})
 
	router.get('/userlist', (req, res)=>{
 
		GuserModel.getAllActiveUser(function(results){
			if(req.cookies['uname'] != null && req.session.type=="Admin"){	
				res.render('Adminhome/UserList', {userlist: results});
					
		}else{
			res.redirect('/login');
		}
			
		});
	
	});
	
	router.get('/Blockuser/:id', (req, res)=>{
		Guser ={
			id: req.params.id	
		};
	
		GuserModel.BlockGU( Guser,function(results){
			if(results){
				userModel.BlockUser( Guser,function(result){
				if(result){
					res.redirect('/Adminhome/userlist');
				}
				})
			}
		   });
	   
	   })

	   router.get('/unBlockuser/:id', (req, res)=>{
		GU ={
			id: req.params.id	
		};
	
		GuserModel.unBlockGU( GU,function(results){
			if(results){
				userModel.unBlockUser( GU,function(result){
				if(result){
					res.redirect('/Adminhome/Blocklist');
				}
				})
			}
		   });
	   
	   })
	   router .get('/Searchuserlist/:data',(req,res)=>{

		if(req.params.data != null){
			var data = JSON.parse(req.params.data);
			console.log(data);
			if(data.key.length == 0){
				GuserModel.getAllActiveUser(function(results){
				
						res.json({result: results});
					
				});
			}else{
				GuserModel.GetAllGubykey(data.key, function(results){
						res.json({result: results});
					
				});
			}
		}
	 
	})

     //////Notification


	 router.post('/NotificationAd/:id', (req, res)=>{
		notify={
			id: req.params.id,
			userid: req.cookies['uname'],
			subject: req.body.subject,
			body: req.body.body
		}
		   AdminModel.AddNotification(notify,function(status){
			   if(status){
				res.redirect('/Adminhome');
			   }else {
				res.redirect('/Adminhome');
			   }
			   
		   });
	   
	   })
	
	   router.get('/NotificationAd/:id', (req, res)=>{
		users ={
		   id: req.params.id,
		   userid: req.cookies['uname']
	   };
	   if(req.cookies['uname'] != null && req.session.type=="Admin"){	
		res.render('Adminhome/NotificationAd', users);
	  
		}else{
			res.redirect('/login');
		}
			 
	  })

	  router.get('/Notification', (req, res)=>{
		//res.render('Adminhome/Mynotification');
		
		   AdminModel.MyNotification(req.cookies['uname'],function(results){
			if(req.cookies['uname'] != null && req.session.type=="Admin"){	
				res.render('Adminhome/Mynotification', {userlist: results});
			  
				}else{
					res.redirect('/login');
				}
			   
		   });
	   
	   })


 ///////pending Post Request

   router.get('/PendingPost', (req, res)=>{
	//res.render('Adminhome/PendingPostAd');
	postreqModel.getAllpostreq(function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/PendingPostAd', {userlist: results});
			}else{
				res.redirect('/login');
			}
		   
	   });
   
   })
   router.get('/ApprovePostreq/:id', (req, res)=>{
	posts={
		id: req.params.id,	
	}
	
	postreqModel.getpostreqbyID(posts,function(results){
		if (results.length>0){
			//console.log(results[0]);
			post.insertpost(results[0],req.cookies['uname'],function(status){
				if(status){
					postreqModel.deletePost(posts,function(status){
						if(status){
							res.redirect('/Adminhome/PendingPost'); 	
						}
						
					})
					
				}
			})
		}
		  
	   });
   
   })

   router.get('/RemovePostreq/:id', (req, res)=>{
	posts={
		id: req.params.id,	
	}
	postreqModel.deletePost(posts,function(status){
		if(status){
			res.redirect('/Adminhome/PendingPost'); 	
		}
		
	})
})



router .get('/SearchPost/:data',(req,res)=>{

	if(req.params.data != null){
		var data = JSON.parse(req.params.data);
		console.log(data);
		if(data.key.length == 0){
			post.getAllpost(function(results){
			
					res.json({result: results});
				
			});
		}else{
			post.getAllpostbyKey(data.key, function(results){
					res.json({result: results});
				
			});
		}
	}
 
})
//////pending Signup Request


   router.get('/PendingSignup', (req, res)=>{
	   regreqModel.getAllregreq(function(results){
		if(req.cookies['uname'] != null && req.session.type=="Admin"){	
			res.render('Adminhome/PendingSignUpAd', {userlist: results});
			}else{
				res.redirect('/login');
			}
		   
	   });
   
   })

   router.get('/approvegureq/:id', (req, res)=>{
	Guser={
		id: req.params.id,	
	}
	
	regreqModel.getregreqbyID(Guser,function(results){
		if (results.length>0){
			//console.log(results[0]);
			GuserModel.insertGU(results[0],function(status){
				if(status){
					regreqModel.RemoveregReq(Guser,function(status){
						if(status){
							res.redirect('/Adminhome/PendingSignup'); 	
						}
						
					})
					
				}
			})
		}
		  
	   });
   
   })   

   router.get('/removegureq/:id', (req, res)=>{
	Guser={
		id: req.params.id,	
	}
	regreqModel.RemoveregReq(Guser,function(status){
		if(status){
			res.redirect('/Adminhome/PendingSignup'); 	
		}
		
	})
})
   

   router.get('/post', (req, res)=>{
	//res.render('Adminhome/Mynotification');
	
	   post.getAllpostAd(function(results){
		post.getAllpost(function(result){
			if(req.cookies['uname'] != null && req.session.type=="Admin"){	
				res.render('Adminhome/post',{post:results, gpost:result });
				}else{
					res.redirect('/login');
				}
			
		});
	
	   });
   
   })
   router.post('/post', (req, res)=>{
	pst={
		adid:req.cookies['uname'],
		text:req.body.post	

	}
	console.log(req.cookies['uname'])
	   post.postadmin(pst,function(results){
		if(results){
			res.redirect('/Adminhome/post');
		}
	   });
   
   })
   router.post('/Insert',upload.single('img'),[

check('username')
.exists()
.withMessage('Must exists')
.isLength({min: 5})
.withMessage('minimum 5 char long')
.notEmpty()
.withMessage('can not be empty'),

check('name','please insert the name')

.exists()
.notEmpty()
.withMessage('fild Must be filled up ')
.isLength({min:5})
.withMessage('Must be contain atleast 5 charecter'),
check('email','invalid email')
.isEmail()
.normalizeEmail(),

check('dob','invalid dob')
.notEmpty(),
check('address','invalid address')
.notEmpty(),


   ],

   (req,res)=>{
	var user={
		img:req.file.filename,
		name: req.body.name,
		username: req.body.username,
		password: "1",
		email:req.body.email,
		gender:req.body.gender,
		dob:req.body.dob,
		add:req.body.address,
		type: req.body.type,
		status: "Active"
	}

	  const errors =validationResult(req)
	  {
		  if (!errors.isEmpty())
		  {
			//return res.status(422).jsonp(errors.array())
			const alert =errors.array();
			res.render('Adminhome/Insert',{al:alert})
		  }
	  }
	 //console.log (req.body.img)
	
	   let isvalid=true;
	   userModel.getByIdUservalid(req.body.username,function(status){
		//console.log(status);
		if(status.length>0){
			isvalid=false;
		}
	})
	   //if (isvalid){

	   if(req.body.type=="Admin"){
		   
		AdminModel.insertAdmin(user,function(results){
			if (results){
				userModel.insertUser(user,function(status){
					if (status)
					{
						res.redirect('/Adminhome/AdminList');
					}
				})

				}
			});
	   }else if(req.body.type=="Account Control Manager"){

		accContModel.insertAccCont(user,function(results){
			if (results){
				userModel.insertUser(user,function(status){
					if (status)
					{
						res.redirect('/Adminhome/AccountControllerList');
					}
				})

				}
			});

	   }else if(req.body.type=="Content Control Manager"){

		contentcontModel.insertContentCont(user,function(results){
			if (results){
				userModel.insertUser(user,function(status){
					if (status)
					{
						res.redirect('/Adminhome/ContentControllerList');
					}
				})
				}
			});
	  }
	/*}
	else {
		let msg='Username already in use'
		res.render('Adminhome/Insert',{al:msg})
	}*/
   })

   router.get('/Insert', (req, res)=>{
		
	if(req.cookies['uname'] != null && req.session.type=="Admin"){	
		res.render('Adminhome/Insert');
	  
		}else{
			res.redirect('/login');
		};
	  
   })
   
   router.get('/Blocklist', (req, res)=>{
	
	GuserModel.GetAllblockGU(function(results){
		accContModel.GetAllblockAC(function(result){
			contentcontModel.GetAllblockCC(function(resul){
				//console.log (results,result,resul);
				if(req.cookies['uname'] != null && req.session.type=="Admin"){	
					res.render('Adminhome/Blocklist',{Gusr:results,AC: result,CC:resul});
				  
					}else{
						res.redirect('/login');
					};
				
			})
		})
	})

})


router .get('/report',(req,res)=>{
	if(req.cookies['uname'] != null && req.session.type=="Admin"){	

		GuserModel.getallgu(function(gu){
			accContModel.GetAllAC(function(ac){
				contentcontModel.GetAllCC(function(cc){
					AdminModel.getAllAdmin(function(ad){
						userModel.getblockuser(function (blockuser){

							 count ={
								gucount:gu.length,
								account:ac.length,
								cccount:cc.length,
								adcount:ad.length,
								bloccount:blockuser.length
							}
							
							res.render('Adminhome/report',count);
						})

						
					})
					

				})
			})

		})
		
	  
		}else{
			res.redirect('/login');
		};

	
})

module.exports = router;