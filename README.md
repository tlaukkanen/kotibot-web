# Kotibot Web App

Checkout the [Demo](https://kotibot.azurewebsites.net/)

This is a small web app to display information from the sensor in my house

Technologies used:
* React & Material UI for front-end
* .NET Core for backend API
* Entity Framework Core & SQL Server for database

![](doc/screely.png)

# Development

You can develop project on your own machine with the following steps:

1. Install NPM packages in `KotibotWeb/ClientApp` folder with `npm install`
2. Start SQL Server with docker in project root `docker-compose up -d`
3. Initialize database `dotnet ef database update`
4. Start debugging the project either from VS Code or from command line `dotnet run`

# Setup

I'm using Raspberry Pi with DHT-22 sensor to publish temperature data to app. App stores the data to SQL Server and uses small React app to render chart of the most recent data.