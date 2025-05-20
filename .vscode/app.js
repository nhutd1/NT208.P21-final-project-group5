/// <reference path="c:/Users/charl/.vscode/extensions/nur.script-0.2.1/@types/api.global.d.ts" />
/// <reference path="c:/Users/charl/.vscode/extensions/nur.script-0.2.1/@types/vscode.global.d.ts" />
//  @ts-check
//  API: https://code.visualstudio.com/api/references/vscode-api

function activate(_context) {
   window.showInformationMessage('Hello, World!');
}

function deactivate() {}

module.exports = { activate, deactivate }

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
