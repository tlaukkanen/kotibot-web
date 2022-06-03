param appName string = 'kotibot'
param location string = resourceGroup().location
param envName string = 'dev'

var vnetName = 'vnet-${appName}'
var pipName = 'pip-${appName}'
var pipNicName = 'pip-nic${appName}'
var domainNameLabel = appName
var agwName = 'agw-${appName}'
var nicName = 'nic-${appName}'
var kvName = 'kv-${appName}'
var ipconfigName = 'ipconfig-${appName}'
var virtualNetworkPrefix = '10.0.0.0/16'
var subnetPrefix = '10.0.0.0/24'
var backendSubnetPrefix = '10.0.1.0/24'

// storage accounts must be between 3 and 24 characters in length and use numbers and lower-case letters only
var storageAccountName = 'st${appName}'
var hostingPlanName = 'plan-${appName}'
var appInsightsName = 'appi-${appName}'
var functionAppName = 'fn-${appName}'
var storageAccountContainerName = '${storageAccountName}/default/artifacts'

resource publicIpAddress 'Microsoft.Network/publicIPAddresses@2021-08-01' = {
  name: pipName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Dynamic'
    dnsSettings: {
      domainNameLabel: domainNameLabel
    }
  }
}

resource publicNicIpAddress 'Microsoft.Network/publicIPAddresses@2021-08-01' = {
  name: pipNicName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    publicIPAddressVersion: 'IPv4'
    publicIPAllocationMethod: 'Dynamic'
    /*    
    dnsSettings: {
      domainNameLabel: domainNameLabel
    }
    */
  }
}


resource vnet 'Microsoft.Network/virtualNetworks@2021-08-01' = {
  name: vnetName
  location: location
  dependsOn: [
    publicIpAddress
  ]
  properties: {
    addressSpace: {
      addressPrefixes: [
        virtualNetworkPrefix
      ]
    }
    subnets: [
      {
        name: 'myAGSubnet'
        properties: {
          addressPrefix: subnetPrefix
          privateEndpointNetworkPolicies: 'Enabled'
          privateLinkServiceNetworkPolicies: 'Enabled'
        }
      }
      {
        name: 'myBackendSubnet'
        properties: {
          addressPrefix: backendSubnetPrefix
          privateEndpointNetworkPolicies: 'Enabled'
          privateLinkServiceNetworkPolicies: 'Enabled'
        }
      }
    ]
    enableDdosProtection: false
    enableVmProtection: false
  }  
}

resource appGateway 'Microsoft.Network/applicationGateways@2021-08-01' = {
  name: agwName
  location: location
  properties: {
    sku: {
      name: 'Standard_Small'
      capacity: 1
      tier: 'Standard'
    }
    gatewayIPConfigurations: [
      {
        name: 'appGatewayIpConfig'
        properties: {
          subnet: {
            id: resourceId('Microsoft.Network/virtualNetworks/subnets', vnetName, 'myAGSubnet')
          }
        }
      }
    ]
    frontendIPConfigurations: [
      {
        name: 'appGwPublicFrontendIp'
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicIpAddress.id //resourceId('Microsoft.Network/publicIPAddresses', pipName)
          }
        }
      }
    ]
    frontendPorts: [
      {
        name: 'port_80'
        properties: {
          port: 80
        }
      }
      {
        name: 'port_443'
        properties: {
          port: 443

        }         
      }

    ]
    backendAddressPools: [
      {
        name: 'myBackendPool'
        properties: {}
      }
    ]
    backendHttpSettingsCollection: [
      {
        name: 'myHTTPSetting'
        properties: {
          port: 80
          protocol: 'Http'
          cookieBasedAffinity: 'Disabled'
          pickHostNameFromBackendAddress: false
          requestTimeout: 20
        }
      }
    ]
    httpListeners: [
      {
        name: 'myHttpListener'
        properties: {
          frontendIPConfiguration: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendIPConfigurations', agwName, 'appGwPublicFrontendIp')
          }
          frontendPort: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendPorts', agwName, 'port_80')
          }
          protocol: 'Http'
          requireServerNameIndication: false
        }
      }
     /* {
        name: 'myHttpsListener'
        properties: {
          frontendIPConfiguration: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendIPConfigurations', agwName, 'appGwPublicFrontendIp')
          }
          frontendPort: {
            id: resourceId('Microsoft.Network/applicationGateways/frontendPorts', agwName, 'port_443')
          }
          protocol: 'Http'
          requireServerNameIndication: false

        }
      }
      */
    ]
    requestRoutingRules: [
      {
        name: 'myRoutingRule'
        properties: {
          ruleType: 'Basic'
          httpListener: {
            id: resourceId('Microsoft.Network/applicationGateways/httpListeners', agwName, 'myHttpListener')
          }
          backendAddressPool: {
            id: resourceId('Microsoft.Network/applicationGateways/backendAddressPools', agwName, 'myBackendPool')
          }
          backendHttpSettings: {
            id: resourceId('Microsoft.Network/applicationGateways/backendHttpSettingsCollection', agwName, 'myHTTPSetting')
          }
        }
      }
    ]
    enableHttp2: false
    /* Autoscaling is not supported with small SKU tier
    autoscaleConfiguration: {
      minCapacity: 0
      maxCapacity: 1
    }
    */
  }
  dependsOn: [
    vnet
  ]
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

// Artifact container is only created to DEV
resource storageAccountContainerForDeploymentArtifacts 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-06-01' = if(envName == 'dev') {
  name: storageAccountContainerName
  properties: {}
}

resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: appInsightsName
  kind: 'web'
  location: location
  properties: { 
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  tags: {
    // circular dependency means we can't reference functionApp directly  /subscriptions/<subscriptionId>/resourceGroups/<rg-name>/providers/Microsoft.Web/sites/<appName>"
     'hidden-link:/subscriptions/${subscription().id}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/${functionAppName}': 'Resource'
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2020-10-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1' 
    tier: 'Dynamic'
//    tier: 'Standard'
//    name: 'S1'

  }
}

resource functionApp 'Microsoft.Web/sites@2020-06-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    keyVault
  ]
  properties: {
    httpsOnly: true
    serverFarmId: hostingPlan.id
    clientAffinityEnabled: true
    siteConfig: {
      ipSecurityRestrictions:[
        /* Example of IP restriction
        {
          action: 'Allow'
          name: 'Some network'
          ipAddress: '194.123.123.123/32'
          priority: 100
        }
        */
      ]
      appSettings: [
        {
          'name': 'APPINSIGHTS_INSTRUMENTATIONKEY'
          'value': appInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
        }
        {
          'name': 'FUNCTIONS_EXTENSION_VERSION'
          'value': '~4'
        }
        {
          'name': 'FUNCTIONS_WORKER_RUNTIME'
          'value': 'dotnet'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
        }
        {
          name: 'Settings:Test'
          value: '@Microsoft.KeyVault(SecretUri=${kvName}.vault.azure.net/secrets/TestSecret)'
        }
      ]
    }
  }
}


resource networkInterface 'Microsoft.Network/networkInterfaces@2021-05-01' = {
  name: nicName
  location: location
  properties: {
    ipConfigurations: [
      {
        name: ipconfigName
        properties: {
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: {
            id: publicNicIpAddress.id //resourceId('Microsoft.Network/publicIPAddresses', pipName)
          }
          subnet: {
            id: resourceId('Microsoft.Network/virtualNetworks/subnets', vnetName, 'myBackendSubnet')
          }
          primary: true
          privateIPAddressVersion: 'IPv4'
          applicationGatewayBackendAddressPools: [
            {
              id: resourceId('Microsoft.Network/applicationGateways/backendAddressPools', agwName, 'myBackendPool')
            }
          ]
        }
      }
    ]
    enableAcceleratedNetworking: false
    enableIPForwarding: false
  }
  dependsOn: [
    appGateway
  ]
}

resource keyVault 'Microsoft.KeyVault/vaults@2021-11-01-preview' = {
  name: kvName
  location: location
  properties: {
    accessPolicies: [
    ]
    sku: {
      name: 'standard'
      family: 'A'
    }
    tenantId: subscription().tenantId
    //enableRbacAuthorization: true
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: true
  }

  resource secret 'secrets' = {
    name: 'TestSecret'
    properties: {
      value: 'testValue'
    }
  }

}


output publicIpAddress string = publicIpAddress.id
