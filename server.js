var cluster = require('cluster');

cluster('./app')
	.set('workers', 1)
	.use(cluster.logger('logs'))
	.use(cluster.stats({ connections: true, requests: true }))
	.use(cluster.pidfiles('pids'))
	.use(cluster.cli())
	.use(cluster.reload())
	.use(cluster.repl(8888))
	.listen(3001);