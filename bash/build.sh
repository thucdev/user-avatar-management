json -I -f package.json -e "this._moduleAliases['@entities']='dist/src/entities'" && \n
json -I -f package.json -e "this._moduleAliases['@common']='dist/src/common'" && \n
json -I -f package.json -e "this._moduleAliases['@repositories']='dist/src/repositories'"