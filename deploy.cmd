IF EXIST "gulpfile.js" (
 pushd "%DEPLOYMENT_TARGET%"
 call .\node_modules\.bin\gulp
 IF !ERRORLEVEL! NEQ 0 goto error
 popd
)
