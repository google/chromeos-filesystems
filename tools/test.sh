#! /usr/bin/env bash

cd $1
cp -r ../testserver/assets ../testserver/liveassets
grunt test
rm -rf ../testserver/liveassets
