
# DEPENDENCIES
### Hardware Requirements
1. Windows/Linux host (dedicated or VPS)
1. Min 600MB RAM*
1. Min 200MB storage space*
*Storage and RAM requirements are subjected to increase with increase in users and data on in the application.

### Software Requirements
1. NodeJs v8 or higher
1. MongoDb server running on the host machine or somewhere accessible
1. NPM or yarn for handling node packages.
1. Python or curl or other node application to create initial requests to make roles.

# GETTING STARTED
Following are the steps for getting the submitted server.tar.gz file up and running as intended.
1. Extract server.tar.gz file in a preferred location.
1. Open config.js and fill appropriate details about the mongoDB server, preferred application id and a secure master key, a master key can be any sequence of alphanumeric characters. Also choose the port for your server.
1. Type npm install or yarn install to sync all the node modules required for the package.
1. After the packages are synced and config.js is properly filled you may try typing npm start to test the server in console.
1. Check whether the provided port is listening for requests by either going to the url/parse if it responds by {"error":"unauthorized"}, congratulations!! Your server is up and running.
## CREATING APPROPRIATE CLASSES
Following commands will help you to create required roles and also create one super admin user which can then in turn be used in the client application to create other users. The following lines show how to perform this using curl, you can get your platform specific instructions at https://docs.parseplatform.org/rest/guide/
**STEP 1: Creating a user.**
```
curl -X POST \
  -H "X-Parse-Application-Id: ${APPLICATION_ID}" \
  -H "X-Parse-REST-API-Key: ${REST_API_KEY}" \
  -H "X-Parse-Revocable-Session: 1" \
  -H "Content-Type: application/json" \
  -d '{"username":"superDude","password":"p_n7!-e8","phone":"9745656165"}' \
  https://YOUR.PARSE-SERVER.HERE/parse/users
```

The response to this request should be a json file like:
```
{"createdAt": "2011-11-07T20:58:34.448Z", "objectId": "g7y9tkhB7O", "sessionToken": "r:pnktnjyb996sj4p156gjtp4im"}
```
You should now note down the objectId of the created user.
**STEP 2: Creating roles.**
We will now make the above user the superAdmin and also create a recruiter role which you can use later. Following is the request for superAdmin role
```
curl -X POST \
  -H "X-Parse-Application-Id: ${APPLICATION_ID}" \
  -H "X-Parse-REST-API-Key: ${REST_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "SuperAdmin",
        "ACL": {
          "*": {
            "read": true
          }
        },
        "users": {
          "__op": "AddRelation",
          "objects": [
            {
              "__type": "Pointer",
              "className": "_User",
              "objectId": "g7y9tkhB7O"
            }
          ]
        }
      }' \
  https://YOUR.PARSE-SERVER.HERE/parse/roles
```
The above code will assign the prior created user to the SuperAdmin role, now you can use that user to do any task in the client application, that user will have all the privileges. 
Now we create a recruiter role.
```
curl -X POST \
  -H "X-Parse-Application-Id: ${APPLICATION_ID}" \
  -H "X-Parse-REST-API-Key: ${REST_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Recruiter",
        "ACL": {
          "*": {
            "read": true
          }
        }
      }' \
  https://YOUR.PARSE-SERVER.HERE/parse/roles
```
After these roles are created, you are all set to change the url and application id in the client application, all other classes will get created as you proceed using the application.


## SUGGESTION
You can also setup a parse dashboard on the same server as that of the parse-server and it will let you have greater control over your database classes and also manage data more efficiently. Following is the link for how to set up a parse dashboard. 
[https://github.com/parse-community/parse-dashboard](https://github.com/parse-community/parse-dashboard)


## LISENCE
[![License](https://img.shields.io/github/license/SushantSangle/jobReferralSystem_server)](https://github.com/SushantSangle/jobReferralSystem_server/blob/master/LICENSE)

