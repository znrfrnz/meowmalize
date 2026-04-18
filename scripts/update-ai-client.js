const fs = require('fs')

const file = 'src/lib/azureAI.ts'
let content = fs.readFileSync(file, 'utf8')

// Update import
content = content.replace(
  "import { AzureOpenAI } from 'openai'",
  "import { AzureOpenAI, OpenAI } from 'openai'"
)

// Update getClient return type and body
content = content.replace(
  `function getClient(): AzureOpenAI {
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const key = process.env.AZURE_AI_KEY
  if (!endpoint || !key) {
    throw new Error('AZURE_AI_ENDPOINT and AZURE_AI_KEY environment variables are required')
  }
  return new AzureOpenAI({
    endpoint,
    apiKey: key,
    apiVersion: '2024-02-01',
  })
}`,
  `function getClient(): AzureOpenAI | OpenAI {
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const key = process.env.AZURE_AI_KEY
  if (!endpoint || !key) {
    throw new Error('AZURE_AI_ENDPOINT and AZURE_AI_KEY environment variables are required')
  }
  // Standard OpenAI API (api.openai.com) — use OpenAI client, not AzureOpenAI
  if (endpoint.startsWith('https://api.openai.com')) {
    return new OpenAI({ apiKey: key })
  }
  return new AzureOpenAI({
    endpoint,
    apiKey: key,
    apiVersion: '2024-02-01',
  })
}`
)

fs.writeFileSync(file, content, 'utf8')
console.log('azureAI.ts updated')
