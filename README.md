# linkr #

web application to save links for viewing later with built in sharing

Inspired by the [Listsurf application](http://j2labs.tumblr.com/post/6030094019/listsurf-i-like-to-send-emails-i-especially) by J2 Labs ([GitHub](https://github.com/j2labs/listsurf)).

Written for Node.js and using MongoDB for backed storage.

## Installing ##

You need to have NodeJS, NPM and MongoDB installed on your system to work.  Follow the directions [here](https://github.com/joyent/node/wiki/Installation) for installing NodeJS/NPM and the directions [here](http://www.mongodb.org/display/DOCS/Quickstart) for installing MongoDB on your system.

	npm install express
	npm install ejs
	npm install mongoose  
	npm install hash
	npm install joose
	npm install joosex-namespace-depended


## Running ##

To run the link app, start the server by typing the following command in the linkr directory:

	node app.js

If everything went ok (it should if you followed the install), you will see the following printed to the screen:

	Express server listening on port 3001

Now you can point your browser to (http://localhost:3001) to start interacting with linkr.

