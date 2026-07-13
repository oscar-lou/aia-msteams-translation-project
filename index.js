require("dotenv").config();
const express = require("express");
const {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  ConfigurationBotFrameworkAuthentication,
} = require("botbuilder");
const { TranslatorBot } = require("./translatorBot");

// Credentials come from your Azure Bot registration (README step 2).
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId,
  MicrosoftAppPassword: process.env.MicrosoftAppPassword,
  MicrosoftAppType: process.env.MicrosoftAppType || "SingleTenant",
  MicrosoftAppTenantId: process.env.MicrosoftAppTenantId,
});

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
  {},
  credentialsFactory
);

const adapter = new CloudAdapter(botFrameworkAuthentication);

adapter.onTurnError = async (context, error) => {
  console.error("[onTurnError]", error);
  await context.sendActivity("The translator hit an error. Check the server logs.");
};

const bot = new TranslatorBot();

const app = express();
app.use(express.json());

app.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, (context) => bot.run(context));
});

app.get("/", (_req, res) => res.send("Teams translate extension is running."));

const port = process.env.PORT || 3978;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  console.log("Messaging endpoint: POST /api/messages");
});
