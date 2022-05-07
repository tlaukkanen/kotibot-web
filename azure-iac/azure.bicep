param location string = resourceGroup().location
param botName string = 'bot-kotibot'
param appServicePlanName string = 'plan-kotibot'
param appServiceName string = 'kotibot'

resource botService 'Microsoft.BotService/botServices@2021-05-01-preview' = {
  name: botName
  location: location
  sku: {
    name: 'F0'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'D1'
  }
}

resource appService 'Microsoft.Web/sites@2021-03-01' = {
  name: appServiceName
  location: location
}
