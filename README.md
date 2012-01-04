# [linkr](http://linkr.cc) #

web application to save links for viewing later with built in sharing

Inspired by the [Listsurf application](http://j2labs.tumblr.com/post/6030094019/listsurf-i-like-to-send-emails-i-especially) by J2 Labs ([GitHub](https://github.com/j2labs/listsurf)).

Written for Node.js and using MongoDB for backed storage.

Blog post about linkr [here](http://blog.jpgtransfer.com/post/6220484007/linkr-a-link-saver)

## Installing ##

You need to have NodeJS, NPM, MongoDB and Redis installed on your system to work.  Follow the directions [here](https://github.com/joyent/node/wiki/Installation) for installing NodeJS/NPM, the directions [here](http://www.mongodb.org/display/DOCS/Quickstart) for installing MongoDB and the directions [here](http://redis.io/download) for installing Redis on your system.

Once you have installed NodeJS, NPM, MongoDB and Redis, in the directory where you cloned this repository, issue the following command to install all dependencies:

	npm install .


## Running ##

To run the link app, start the server by typing the following command in the linkr directory:

	node server.js

If everything went ok (it should if you followed the install), you will see the following printed to the screen:

	Express server listening on port 3001

Now you can point your browser to [http://localhost:3001](http://localhost:3001) to start interacting with linkr.

### Running in Production ###

You can run linkr in production with the following command:

	NODE_ENV=production node server.js
	

## Issues ##

- Better error handling in the UI
- Handle errors in Node.io when trying to scrape a site which doesn't have a title tag.  Currently the errors just cause the node process to quit, taking down the entire site.

## License ##

Copyright (c) 2012 Patrick McCoy <patrick.james.mccoy@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
