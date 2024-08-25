#!/bin/bash

yarn run typeorm:create migration:create src/db/migrations/$1
