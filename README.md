# QSMR Document Comparison Tool

A professional, AI-powered frontend application that analyzes documents against QSMR guidelines to identify compliance gaps and provide actionable improvement suggestions.

## Features

- Compare Standard Operating Procedures (SOPs) against QSMR guidelines
- Identify regulatory compliance gaps with detailed analysis
- Receive professional recommendations to align with QSMR requirements
- View specific QSMR clause references with detailed explanations
- Get comprehensive summaries of the comparison results
- Modern, responsive user interface with intuitive navigation

## Technology Stack

- HTML5 for structure
- CSS3 with Tailwind CSS for responsive design
- Vanilla JavaScript for functionality
- Marked.js for Markdown rendering
- Font Awesome for icons

## How to Use

1. Open the application in a web browser
2. Configure your AI service connection in the settings (first-time setup)
3. Select the SOP document and QSMR guideline from the dropdown menus
4. Click "Process Comparison" to analyze the documents
5. View the results in the tabbed interface:
   - OLD TEXT: Original SOP content
   - GAP FOUND: Identified compliance gaps
   - SUGGESTED UPDATE: Recommended changes to align with QSMR
   - QMSR REFERENCE: Specific guideline references
   - SUMMARY: Overview of the comparison

## AI Integration

The application leverages artificial intelligence to perform document comparison and analysis. You'll need to provide your own AI service credentials in the settings panel.

## Local Development

To run the application locally:

1. Clone the repository
2. Open `index.html` in a web browser
3. For testing without an AI service, the application includes mock data

No build process or server is required as this is a pure frontend application.

## Data Files

The application uses the following data files:
- `data/sop.pdf`: Standard Operating Procedure document
- `data/qsmr_guidelines.pdf`: Quality Management System Regulation guidelines

## Security Considerations

- All document processing happens locally in the browser
- No document data is stored on external servers
- API credentials are stored in your browser's local storage
- You can use your own AI service by configuring the settings

## Contributing

Contributions to improve the application are welcome. Please feel free to submit pull requests or open issues for any bugs or feature requests.
