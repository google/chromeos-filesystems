#! /usr/bin/env bash

cd $1
cp -r ../testserver/assets ../testserver/liveassets
grunt test
exitcode=$?
rm -rf ../testserver/liveassets
exit $exitcode
