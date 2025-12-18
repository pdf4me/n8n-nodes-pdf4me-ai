const { Pdf4meAi } = require('./dist/nodes/Pdf4me/Pdf4me.node.js');
const { Pdf4meAiApi } = require('./dist/credentials/Pdf4meApi.credentials.js');

module.exports = {
  nodes: {
    Pdf4meAi,
  },
  credentials: {
    Pdf4meAiApi,
  },
};
