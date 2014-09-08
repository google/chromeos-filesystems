.PHONY: setup teardown start

setup:
	# Ensure that the live assets directory hasn't been created since the last run
	rm -rf liveassets
	cp -r assets liveassets

teardown:
	rm -rf liveassets

start:
	node server.js
