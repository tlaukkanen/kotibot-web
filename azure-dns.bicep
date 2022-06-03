param zoneName string = 'codeof.me'
param recordName string = 'kotibot'

resource zone 'Microsoft.Network/dnsZones@2018-05-01' = {
  name: zoneName
  location: 'global'
}

resource record 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  parent: zone
  name: 'kotibot'
  properties: {
    CNAMERecord: {
      cname: 'kotibot.westeurope.cloudapp.azure.com'
    }
  }
}
