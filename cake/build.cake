#addin "Cake.WebDeploy"

var target = Argument("target", "Production");

Task("Production")
    .Description("Deploy to Azure using a custom Url")
    .Does(() =>
    {
        var settings = new DeploySettings()
        {
            SourcePath = @"..\dist",
            PublishUrl = "https://119.59.100.90:8172/msdeploy.axd",
            SiteName = "SoftFemo",
            Username = "",
            Password = ""
        };
        DeployWebsite(settings);
    });

Task("Default")
    .IsDependentOn("Production");

RunTarget(target);
