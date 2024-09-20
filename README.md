Start all services and kubernetes

> Navigate to /ticketing/
> run `scaffold dev`
> Make sure to redirect ticketing.dev to localhost in

> /etc/hosts ->
> `127.0.0.1 ticketing.dev`

from browser, hit this URL to launch app(in local)

> http://ticketing.dev

> If you are not able to delete pods started by containers
> run `skaffold delete`

> JWT secret in kubectl - jwt-secret > JWT_KEY
> set screts -> k create secret generic jwt-secret --from-literal=JWT_KEY=asdf
> k get secrets
