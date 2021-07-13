# set-variable-based-on-environment

This action can be used to set a single output and environment variable based on the current environment.  This action is configured for im-open's needs so the Environments this action recognizes are:
| Environment | Accepted Values (case insensitive) |
| ----------- | ---------------------------------- |
| Dev         | *d, dev, development*              |
| QA          | *q, qa*                            |
| Stage       | *s, stg, stage*                    |
| Prod        | *p, prod, production*              |
| Demo        | *o, demo*                          |
| UAT         | *u, uat*                           |

The action itself is pretty simple and is a way to streamline the workflow by eliminating complex `case` or `if` statements that have to normalize the environment and figure out the correct value to use for which environment.  

When using the action, you only need to provide values for the environments you would use.  If the action cannot find a value for the `current-environment`, the output and environment variables will be set to an empty string.
   

## Inputs
| Parameter             | Is Required | Description                                                                                      |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `variable-name`       | true        | The name of the output variable and the environment variable that will be set                    |
| `current-environment` | true        | The current environment                                                                          |
| `dev-value`           | false       | The value the output and environment variable will be set to if Dev is the current environment   |
| `qa-value`            | false       | The value the output and environment variable will be set to if QA is the current environment    |
| `stage-value`         | false       | The value the output and environment variable will be set to if Stage is the current environment |
| `prod-value`          | false       | The value the output and environment variable will be set to if Prod is the current environment  |
| `demo-value`          | false       | The value the output and environment variable will be set to if Demo is the current environment  |
| `uat-value`           | false       | The value the output and environment variable will be set to if UAT is the current environment   |

## Outputs
| Output          | Description                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variable-name` | The output will match the value that corresponds with the current environment.  It will be named whatever was provided in the `variable-name` argument. |

## Example

```yml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'The environment to deploy to'
        required: true

jobs:
  parse-inputs:
    runs-on: [ubuntu-20.04]
    outputs:
      RESOURCE_GROUP: ${{ steps.set-rgrp.outputs.RESOURCE_GROUP}}
    steps:
      - name: Set the Resource Group
        id: set-rgrp
        uses: im-open/set-variable-based-on-environment@v1.0.0
        with:
          variable-name: 'RESOURCE_GROUP'
          current-environment: ${{ github.event.inputs.environment }}
          dev-value: 'my-dev-RGRP'
          stage-value: 'my-stage-RGRP'
          prod-value: 'my-prod-RGRP'
      
      - name: Write out the Resource Group
        run: echo "The current resource group is: '${{ env.RESOURCE_GROUP }}'"
  
  start-deploy:
    runs-on: [ubuntu-20.04]
    needs: [parse-inputs]
    steps:
      - run: echo "The current resource group is '${{ needs.parse-inputs.outputs.RESOURCE_GROUP }}'"

      
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
