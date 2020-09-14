//Function to get the number of unique views for a given post
Parse.Cloud.define('getViews',async(request)=> {
    const query = new Parse.Query("jobPosts");
        query.get(request.params.objectId);
        const result = await query.find();
        let count = 0;
        var views;
        if(result.length==1){
            views= result[0];
            var relation = new Parse.Relation(views,"views").query();
            var relations= await relation.find();
            count = relations.length;
            delete relation;
        }else{
            count = 0;
        }
        return count;
});
//Function to save config
Parse.Cloud.define('saveConfig',async(request)=>{
	try{
        const wquery = new Parse.Query(Parse.Role).equalTo('users', request.user);
        const roles = await wquery.find();
        for(i in roles){
            if(roles[i].get('name')=='SuperAdmin'){
                const config = await Parse.Config.get();
                if(request.params.logo){
                    const logo = config.get('logo');
                    await logo.destroy();
                }
                await Parse.Config.save(request.params,{useMasterKey:true});
                return 200;
            }
        }
    }catch(error){
        return 403;
    }
    return 403;
});
//Function to link a comment to a post
Parse.Cloud.afterSave("comments",async(request)=> {
    const query= new Parse.Query("jobPosts");
    query.get(request.object.get("fromPost")._getId())
        .then((jobPost)=>{
            var relation = new Parse.Relation(jobPost,"postComments");
            relation.add(request.object);
            jobPost.save(null,{useMasterKey:true});
        }).catch((error)=>{
            console.error("Got an error "+error.code+":"+error.message);
     });
});
//Function to save employeeData pointer in user
Parse.Cloud.afterSave("employeeData",async(request)=>{
    try{
        var user=request.object.get("UserPointer");
        user.set("data",request.object.toPointer());
        await user.save(null,{useMasterKey:true});
    }catch(error){
        console.log("ERROR WITH EMPLOYEE DATA AFTERSAVE"+error);
    }
});
//Function to delete user
Parse.Cloud.beforeDelete("employeeData",async(request,response)=>{
    try{
        const user = request.object.get("UserPointer");
        console.log(response);
        user.destroy({useMasterKey:true}).then(()=>{
            console.log("USER DELETED--------------------------------------------------------------------------------------");
        }).catch((error)=>{
            console.log(error);
        });
    }catch(error){
        console.log("ERROR with Deleting user");
    }
});
//Function to give write access on new users to all recruiters
Parse.Cloud.beforeSave(Parse.User,async(request)=> {
    var acl = new Parse.ACL({
        "*":{ "read":true,"write":false},
    });
    acl.setRoleReadAccess("Recruiter",true);
    acl.setRoleReadAccess("SuperAdmin",true); 
    acl.setRoleWriteAccess("Recruiter",true);
    acl.setRoleWriteAccess("SuperAdmin",true); 
    request.object.set("ACL",acl);
});
//Function to give write access on jobPosts to all recruiters
Parse.Cloud.beforeSave("jobPosts",async(request)=> {
    var acl = new Parse.ACL({
        "*":{"read":true,"write":false},
    });
    acl.setRoleWriteAccess("Recruiter",true);
    acl.setRoleWriteAccess("SuperAdmin",true);
    request.object.set("ACL",acl);
});
//Function to get Role of user 
Parse.Cloud.define('getRoles',async(request)=> {
    const wquery = new Parse.Query(Parse.Role).equalTo('users', request.user);
    const query = await wquery.find();
    console.log(query);
    return query
});
