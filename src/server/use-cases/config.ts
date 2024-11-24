export const configFile = () => {
  const config = {
    appMode: "production",
    logPath: "/var/logs/app.log",
  };

  console.log("Running in", config.appMode, "mode.");
  console.log("Logs will be saved to", config.logPath);
};
