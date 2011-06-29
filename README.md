# [linkr](http://linkr.cc) #

web application to save links for viewing later with built in sharing

Inspired by the [Listsurf application](http://j2labs.tumblr.com/post/6030094019/listsurf-i-like-to-send-emails-i-especially) by J2 Labs ([GitHub](https://github.com/j2labs/listsurf)).

Written for Node.js and using MongoDB for backed storage.

Blog post about linkr [here](http://blog.jpgtransfer.com/post/6220484007/linkr-a-link-saver)

## Installing ##

You need to have NodeJS, NPM and MongoDB installed on your system to work.  Follow the directions [here](https://github.com/joyent/node/wiki/Installation) for installing NodeJS/NPM and the directions [here](http://www.mongodb.org/display/DOCS/Quickstart) for installing MongoDB on your system.

Once you have installed NodeJS, NPM and MongoDB, in the directory where you cloned this repository, issue the following command to install all dependencies:

	npm install .


## Running ##

To run the link app, start the server by typing the following command in the linkr directory:

	node app.js

If everything went ok (it should if you followed the install), you will see the following printed to the screen:

	Express server listening on port 3001

Now you can point your browser to [http://localhost:3001](http://localhost:3001) to start interacting with linkr.

### Running in Production ###

Right now, Express complains about the Connect memory session store when running in production, but if you are OK with this, you can run in production with the following command:

	NODE_ENV=production node app.js
	

## Issues ##

- Connect memory session store when running in production mode.  I need to move the session store to Redis using connect-redis.
