# n8n-nodes-pdf4me-ai

This is an n8n community node that enables you to integrate PDF4ME's powerful AI-powered document processing capabilities into your n8n workflows. PDF4ME AI uses advanced machine learning technology to extract structured data from various document types including invoices, contracts, health cards, mortgage documents, bank cheques, credit cards, pay stubs, and marriage certificates.

n8n is a fair-code licensed workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage](#usage)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

### Community Nodes (Recommended)

For users on n8n v0.187+, you can install this node directly from the n8n Community Nodes panel in the n8n editor:

1. Open your n8n editor
2. Go to **Settings > Community Nodes**
3. Search for "n8n-nodes-pdf4me-ai"
4. Click **Install**
5. Reload the editor

### Global Installation (Recommended)

For global installation that makes the node available across all n8n projects:

```bash
# Install globally
npm install -g n8n-nodes-pdf4me-ai

# Restart n8n to load the new node
n8n start
```

### Manual Installation

You can also install this node manually in a specific n8n project:

1. Navigate to your n8n installation directory
2. Run the following command:
   ```bash
   npm install n8n-nodes-pdf4me-ai
   ```
3. Restart your n8n server

For Docker-based deployments, add the package to your package.json and rebuild the image:

```json
{
  "name": "n8n-custom",
  "version": "0.9.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "n8n"
  },
  "dependencies": {
    "n8n": "^1.0.0",
    "n8n-nodes-pdf4me-ai": "^0.8.0"
  }
}
```

## What's New in Version 0.8.0

Version 0.8.0 brings comprehensive AI-powered document processing capabilities:

- **🤖 AI-Powered Processing**: Extract structured data from documents using advanced AI/ML technology
- **📄 Multiple Document Types**: Support for 8 different document types including invoices, contracts, health cards, and more
- **🔄 Async Processing**: Automatic handling of async document processing with polling
- **📊 Structured Output**: Returns structured JSON data ready for integration with other n8n nodes
- **🎯 Custom Fields**: Support for custom field extraction in invoice processing
- **✅ Reliable**: Enhanced error handling and retry logic for robust workflow execution

## Operations

This node provides AI-powered document processing capabilities through PDF4ME's AI API. Here are the available operations:

### AI-Powered Document Processing

1. **AI-Invoice Parser**
   - Extract structured data from invoices using AI/ML technology
   - Automated data entry for accounting systems
   - Supports custom field extraction (phone, email, tax ID, etc.)
   - Extracts amounts, dates, vendor information, and line items

2. **AI-Process Contract**
   - Extract structured data from contracts using AI/ML technology
   - Legal document analysis and review
   - Automated contract data extraction

3. **AI-Process HealthCard**
   - Extract structured data from health cards using AI/ML technology
   - Member management system integration
   - Automated health card data processing

4. **AI-Process Mortgage Document**
   - Extract structured data from mortgage documents using AI/ML technology
   - Loan processing automation
   - Automated mortgage document analysis

5. **AI-Process Bank Cheque**
   - Extract structured data from bank cheques using AI/ML technology
   - Payment processing automation
   - Automated cheque data extraction

6. **AI-Process Credit Card**
   - Extract structured data from credit cards using AI/ML technology
   - Payment processing automation
   - Automated credit card data extraction

7. **AI-Process Pay Stub**
   - Extract structured data from pay stubs using AI/ML technology
   - Payroll processing automation
   - Automated pay stub data extraction

8. **AI-Process Marriage Certificate**
   - Extract structured data from marriage certificates using AI/ML technology
   - Document verification automation
   - Automated certificate data extraction

## Credentials

To use this node, you need a PDF4ME API key. Here's how to get started:

1. Sign up for a PDF4ME account at [PDF4ME Developer Portal](https://dev.pdf4me.com/)
2. Navigate to your dashboard and obtain your API key
3. In n8n, add your PDF4ME credentials by providing your API key

## Usage

This node allows you to automate AI-powered document processing tasks in your n8n workflows. Here are some common use cases:

### AI-Powered Document Processing

#### Invoice Processing
- Automatically extract invoice data for accounting systems
- Process invoices from various formats and layouts
- Extract vendor information, amounts, dates, and line items
- Support for custom field extraction (phone numbers, email addresses, tax IDs, etc.)
- Integrate with accounting software and ERP systems

#### Contract Analysis
- Analyze contracts for legal document review
- Extract key terms, dates, and parties
- Automate contract data entry
- Integrate with legal document management systems

#### Health Card Processing
- Process health cards for member management systems
- Extract member information and coverage details
- Automate enrollment and verification processes
- Integrate with healthcare management systems

#### Mortgage Document Processing
- Process mortgage documents for loan processing
- Extract loan terms, borrower information, and property details
- Automate loan application processing
- Integrate with loan management systems

#### Payment Document Processing
- Process bank cheques for payment automation
- Extract payment information from credit cards
- Process pay stubs for payroll systems
- Automate payment verification and processing

#### Certificate Processing
- Process marriage certificates for document verification
- Extract key information for record-keeping
- Automate certificate verification processes

### Input Methods

All AI operations support multiple input methods for maximum flexibility:

- **Binary Data**: Use document files from previous workflow nodes
- **Base64 String**: Provide document content as base64 encoded strings
- **URL**: Provide URL to document file for processing

### Output Format

All AI operations return structured JSON data containing:
- Extracted document data in a structured format
- Metadata about the processing operation
- Timestamp and source file information
- Custom fields data (if applicable)

### Automated Workflows

- Chain multiple AI processing operations together
- Integrate with database nodes for data storage
- Connect with API nodes for data transmission
- Build complete document processing pipelines
- Automate document classification and routing
- Create end-to-end document workflows with error handling

For detailed examples and workflow templates, visit our documentation.

## Resources

- [PDF4me n8n AI Integration Documentation](https://docs.pdf4me.com/n8n/getting-started/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [PDF4ME API Documentation](https://dev.pdf4me.com/apiv2/documentation/)
- [PDF4ME Developer Portal](https://dev.pdf4me.com/)
- [PDF4ME Support](mailto:support@pdf4me.com)

## Version History

### 0.8.0
- **Latest Version**: Initial release with comprehensive AI-powered document processing
- **AI Operations**: 8 AI-powered document processing operations
  - AI-Invoice Parser with custom field support
  - AI-Process Contract
  - AI-Process HealthCard
  - AI-Process Mortgage Document
  - AI-Process Bank Cheque
  - AI-Process Credit Card
  - AI-Process Pay Stub
  - AI-Process Marriage Certificate
- **Input Methods**: Support for Binary Data, Base64, and URL inputs
- **Async Processing**: Automatic handling of async document processing with polling
- **Error Handling**: Enhanced error handling and retry logic
- **Structured Output**: Returns structured JSON data with metadata
- **Custom Fields**: Support for custom field extraction in invoice processing
- **Enhanced Timeout Handling**: Supports long-running operations with proper timeout handling
- **Node.js Engine**: Requires Node.js >= 20.15
