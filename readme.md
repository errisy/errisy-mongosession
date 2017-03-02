# errisy-mongosession

## a simple mongodb session middleware for [errisy-server](https://www.npmjs.com/package/errisy-server)

This is an simple implementation to session data in cookie.

The session object is stringified and kept in the session data of mongodb.

For a light weight small website, this is an easier solution as it uses mongodb straight away.

Please add this session middleware as the first middleware when used in domainmiddleware [errisy-server](https://www.npmjs.com/package/errisy-server).
