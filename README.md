- [chat-pp](#chat-pp)
  - [Lambda Functions](#lambda-functions)
    - [Updating Lambda Functions](#updating-lambda-functions)

# chat-pp

## Lambda Functions

### Updating Lambda Functions

1. Upload new functions code.
2. List all the function aliases and the version that it points to.
3. Create a new version.
   - Since a new version will not be created if the function code has not changed, it will just return the latest function version.
4. Create a deployment to point the appropriate alias to the new function version.

TODO:

1. Try all of this out in CICD.
2. Set env variables to branch env variables.
