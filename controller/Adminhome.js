const express 	= require('express');
const AdminModel = require.main.require('./models/Admin/adminModel');
const accContModel = require.main.require('./models/Admin/accContModel');
const contentcontModel = require.main.require('./models/Admin/contentcontModel');
const userModel = require.main.require('./models/Admin/userModel');
const GuserModel = require.main.require('./models/Admin/GeneraluserModel');
const postreqModel = require.main.require('./models/Admin/postReq');
const regreqModel = require.main.require('./models/Admin/regreqModel');
const post = require.main.require('./models/Admin/post');
const router 	= express.Router();

router.get('/', (req, res)=>{
	
	if(req.cookies['uname'] != null && req.session.type=="Admin"){
		res.render('Adminhome/HomeAdmin');
		console.log('uname');
	}else{
		res.redirect('/login');
	}
})


/////// Admin

router.get('/AdminList', (req, res)=>{
	//res.render('Adminhome/ContentContList');
	AdminModel.getAllAdmin(function(results){
		res.render('Adminhome/AdminList', {userlist: results});
	});
   
   })
   router.get('/Adminprofile', (req, res)=>{
	res.render('Adminhome/AdminProfile');
	   //userModel.getAll(function(results){
		   //res.render('/Adminhome/UserList', {userlist: results});
	   //});
   
   })
   router.get('/editAccount', (req, res)=>{
	res.render('Adminhome/editAccount');
	   //userModel.getAll(function(results){
		   //res.render('/Adminhome/UserList', {userlist: results});
	   //});
   
   })
    
/////Account Controller
router.get('/AccountControllerList', (req, res)=>{
	
	accContModel.getAllActiveAccCont(function(results){
		   res.render('Adminhome/AccContList', {userlist: results});
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
   


 
///////Content Controller 

   router.get('/ContentControllerList', (req, res)=>{
	//res.render('Adminhome/ContentContList');
	contentcontModel.getAllActiveContentCont(function(results){
		res.render('Adminhome/ContentContList', {userlist: results});
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
			res.render('Adminhome/UserList', {userlist: results});
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
	   
			  res.render('Adminhome/NotificationAd', users);
	  
	  })

	  router.get('/Notification', (req, res)=>{
		//res.render('Adminhome/Mynotification');
		
		   AdminModel.MyNotification(req.cookies['uname'],function(results){
			   res.render('Adminhome/Mynotification', {userlist: results});
		   });
	   
	   })


 ///////pending Post Request

   router.get('/PendingPost', (req, res)=>{
	//res.render('Adminhome/PendingPostAd');
	postreqModel.getAllpostreq(function(results){
		   res.render('Adminhome/PendingPostAd', {userlist: results});
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


//////pending Signup Request


   router.get('/PendingSignup', (req, res)=>{
	   regreqModel.getAllregreq(function(results){
		   res.render('Adminhome/PendingSignUpAd', {userlist: results});
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
   

   /*router.get('/post', (req, res)=>{
	//res.render('Adminhome/Mynotification');
	
	   AdminModel.MyNotification(req.cookies['uname'],function(results){
		   res.render('Adminhome/Mynotification', {userlist: results});
	   });
   
   })*/
   router.post('/Insert',(req,res)=>{
	  var user={
		   img:req.body.img,
		   name: req.body.name,
		   username: req.body.username,
		   password: "",
		   email:req.body.email,
		   gender:req.body.gender,
		   dob:req.body.dob,
		   add:req.body.address,
		   type: req.body.type,
		   status: "Active"
	   }
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
   })
   router.get('/Insert', (req, res)=>{

		   res.render('Adminhome/Insert');
	  
   })
   
 /*  router.get('/Blocklist', (req, res)=>{
		var user={};
		var AC={};
	AdminModel.GetAllblockUser(function(GU,AC,CC){
		res.render('Adminhome/Blocklist');
	})
	

})*/

module.exports = router;