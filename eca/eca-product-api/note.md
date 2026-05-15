xattr -d com.apple.quarantine /Users/demet/dev/eca/eca-product-api/bin/Debug/net8.0/EcaProductApi

<ResourceName>:<Action>:<Scope>
products:create:any

docker ps
docker exec -it 0484b3e62f69 bash

/opt/keycloak/bin/kc.sh export --realm eca --dir /opt/keycloak/data/import
dotnet new webapi -o eca-inventory-api

psql -U eca -d productdb