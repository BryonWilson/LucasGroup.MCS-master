# Military Conference Scheduler

## Project Setup

This project uses DotnetCore 2.1 with [sdk v.2.1.300-rc1](https://www.microsoft.com/net/download/dotnet-core/sdk-2.1.300-rc1).

Once the SDK is setup/installed, run `dotnet build` from the LucasGroup.MCS project folder commandline.

You should see this output:

`
Successfully installed the ASP.NET Core HTTPS Development Certificate.
To trust the certificate run 'dotnet dev-certs https --trust' (Windows and macOS only). For establishing trust on other platforms please refer to the platform specific documentation.
For more information on configuring HTTPS see https://go.microsoft.com/fwlink/?linkid=848054.
`

Unless there was an error, run `dotnet dev-certs https --trust` to trust the dev certificate. There should be a prompt that you need to confirm to complete this action.

## Run Project with "environment" variable

To run the project, execute `dotnet watch run` from the project path. The default running environment is Development.

To run the project in another environment mode, e.g. Staging, execute `dotnet watch run environment=Staging` from the same path.

## Publish project to QA

Run `publish_qa.cmd` from the ./SRC solution directory. The output is stored in the ./Src/deploy folder. Copy the entire contents to the QA site folder and restart site as needed.