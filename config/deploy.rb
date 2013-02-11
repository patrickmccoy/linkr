set :stages, %w(production staging)
set :default_stage, "staging"

set :application, "linkr"
set :repository,  "git@github.com:patrickmccoy/#{application}.git"

set :scm, :git

set :branch, "master"
set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :keep_releases, 5

set :user, "linkr"
set :use_sudo, false

set :deploy_to, "/web/#{application}"
