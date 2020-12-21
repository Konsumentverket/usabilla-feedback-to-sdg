# Usabilla feedback To SDG

Syftet med detta projekt är att automatisera sändningar av feedback kopplat till sidor som representerar innehåll kopplat till SDG.

## Konfiguration

Konfiguration av tjänsten sker genom 'Azure Configurations settings'.  


```json
{
    "SDG_API_KEY": "...",
    "USE_SDG_ACCEPTENCE": true or false,
    "INPAGE_TO_USE": "comma, separated, values, of, inpage, names",
    "USABILLA_PUBLIC_KEY": "1234",
    "USABILLA_SECRET_KEY": "4321",
    "COSMOSDB_CONNECTIONSTRING": "... CosmosDB connectionstring ..."
}
```
