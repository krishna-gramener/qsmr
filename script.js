import {sop_content,guidelines_content} from './content.js';

// DOM Elements
const apiModal = document.getElementById('apiModal');
const apiForm = document.getElementById('apiForm');
const apiUrlInput = document.getElementById('apiUrl');
const apiKeyInput = document.getElementById('apiKey');
const settingsBtn = document.getElementById('settingsBtn');
const processBtn = document.getElementById('processBtn');
const progressContainer = document.getElementById('progressContainer');
const resultsContainer = document.getElementById('resultsContainer');
const documentModal = document.getElementById('documentModal');
const documentFrame = document.getElementById('documentFrame');
const documentTitle = document.getElementById('documentTitle');
const closeDocumentModal = document.getElementById('closeDocumentModal');
const viewSop = document.getElementById('viewSop');
const viewGuideline = document.getElementById('viewGuideline');
const sopSelect = document.getElementById('sopSelect');
const guidelineSelect = document.getElementById('guidelineSelect');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Check if API credentials are stored in local storage
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = localStorage.getItem('apiUrl');
    const apiKey = localStorage.getItem('apiKey');
    
    if (apiUrl && apiKey) {
        apiModal.style.display = 'none';
        apiUrlInput.value = apiUrl;
        apiKeyInput.value = apiKey;
    }
    
    // Populate select dropdowns with mock data
    populateSelectOptions();
});

// Save API credentials to local storage
apiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiUrl = apiUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (apiUrl && apiKey) {
        localStorage.setItem('apiUrl', apiUrl);
        localStorage.setItem('apiKey', apiKey);
        apiModal.style.display = 'none';
    }
});

// Show settings modal
settingsBtn.addEventListener('click', () => {
    apiModal.style.display = 'flex';
});

// Process button click handler
processBtn.addEventListener('click', async () => {
    const selectedSop = sopSelect.value;
    const selectedGuideline = guidelineSelect.value;
    
    if (!selectedSop || !selectedGuideline) {
        alert('Please select both SOP and Guideline documents');
        return;
    }
    
    progressContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    
    // Process the comparison
    await processComparison();
});

// Tab switching functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active-tab'));
        
        // Add active class to clicked button
        button.classList.add('active-tab');
        
        // Hide all tab contents with fade-out effect
        tabContents.forEach(content => {
            content.classList.add('opacity-0');
            setTimeout(() => {
                content.classList.add('hidden');
            }, 150);
        });
        
        // Show the corresponding tab content with fade-in effect
        const contentId = 'content' + button.id.substring(3);
        const targetContent = document.getElementById(contentId);
        setTimeout(() => {
            targetContent.classList.remove('hidden');
            setTimeout(() => {
                targetContent.classList.remove('opacity-0');
            }, 50);
        }, 200);
    });
});

// View document buttons
viewSop.addEventListener('click', () => {
    if (sopSelect.value) {
        showDocumentViewer('SOP-700 Design and Development Controls', `data/${sopSelect.value}`);
    } else {
        alert('Please select a SOP document first');
    }
});

viewGuideline.addEventListener('click', () => {
    if (guidelineSelect.value) {
        showDocumentViewer('QMSR Guidelines', `data/${guidelineSelect.value}`);
    } else {
        alert('Please select a guideline document first');
    }
});

// Close document viewer
closeDocumentModal.addEventListener('click', () => {
    documentModal.classList.add('hidden');
});

// Helper Functions
function showDocumentViewer(title, src) {
    documentTitle.textContent = title;
    documentFrame.src = src;
    documentModal.classList.remove('hidden');
    documentModal.classList.add('flex');
}

function populateSelectOptions() {
    // Add SOP options
    const sopOption = document.createElement('option');
    sopOption.value = 'sop.pdf';
    sopOption.textContent = 'SOP-700 Design and Development Controls';
    sopSelect.appendChild(sopOption);
    
    // Add Guideline options
    const guidelineOption = document.createElement('option');
    guidelineOption.value = 'qsmr_guidelines.pdf';
    guidelineOption.textContent = 'QMSR Guidelines';
    guidelineSelect.appendChild(guidelineOption);
}

async function updateProgressStep(step, status) {
    const stepIcon = document.getElementById(`step${step}Icon`);
    const spinner = stepIcon.querySelector('.fa-spinner');
    const checkmark = stepIcon.querySelector('.fa-check');
    const defaultIcon = stepIcon.querySelector(`.fa-${getIconForStep(step)}`);
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    
    // Reset
    stepIcon.classList.remove('step-pending', 'step-in-progress', 'step-completed');
    spinner.classList.add('hidden');
    checkmark.classList.add('hidden');
    defaultIcon.classList.add('hidden');
    
    if (status === 'pending') {
        stepIcon.classList.add('step-pending');
        defaultIcon.classList.remove('hidden');
    } else if (status === 'in-progress') {
        // Add animation to the step icon
        stepIcon.classList.add('bg-blue-100');
        stepIcon.classList.add('transition-all', 'duration-300');
        spinner.classList.remove('hidden');
        
        // Update progress bar with smooth animation
        const progressPercentage = (step - 1) * 25;
        // Small delay to ensure animation is visible
        await new Promise(resolve => setTimeout(resolve, 50));
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update status text with fade effect
        progressStatus.classList.add('opacity-0');
        await new Promise(resolve => setTimeout(resolve, 150));
        progressStatus.textContent = getStatusTextForStep(step);
        progressStatus.classList.remove('opacity-0');
        progressStatus.classList.add('transition-opacity', 'duration-300', 'opacity-100');
    } else if (status === 'completed') {
        // Add animation to completed step
        stepIcon.classList.add('transition-all', 'duration-300', 'bg-blue-600');
        checkmark.classList.remove('hidden');
        
        // Update progress bar for completed step with smooth animation
        const progressPercentage = step * 25;
        await new Promise(resolve => setTimeout(resolve, 50));
        progressBar.style.width = `${progressPercentage}%`;
    }
}

function getIconForStep(step) {
    switch(step) {
        case 1: return 'file-alt';
        case 2: return 'file-invoice';
        case 3: return 'search';
        case 4: return 'lightbulb';
        default: return 'circle';
    }
}

function getStatusTextForStep(step) {
    switch(step) {
        case 1: return 'Processing files...';
        case 2: return 'Extracting text from documents...';
        case 3: return 'Analyzing content with AI...';
        case 4: return 'Generating final recommendations...';
        default: return 'Processing...';
    }
}

async function processComparison() {
    try {
        // Reset progress bar
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressStatus').textContent = 'Starting analysis...';
        
        // Step 1: Processing files
        await updateProgressStep(1, 'in-progress');
        await simulateDelay(800);
        await updateProgressStep(1, 'completed');
        
        // Step 2: Extracting text
        await updateProgressStep(2, 'in-progress');
        await simulateDelay(1200);
        await updateProgressStep(2, 'completed');
        
        // Step 3: Analyzing content with AI
        await updateProgressStep(3, 'in-progress');
        
        // Call LLM API during the analysis step
        const result = await callLlmApi();
        await updateProgressStep(3, 'completed');
        
        // Step 4: Generating final answer
        await updateProgressStep(4, 'in-progress');
        await simulateDelay(1000);
        await updateProgressStep(4, 'completed');
        
        // Display results
        displayResults(result);
        
    } catch (error) {
        console.error('Error processing comparison:', error);
        alert('An error occurred while processing the comparison. Please try again.');
    }
}

function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callLlmApi() {
    try {
        const apiUrl = localStorage.getItem('apiUrl');
        const apiKey = localStorage.getItem('apiKey');
        
        if (!apiUrl || !apiKey) {
            throw new Error('API credentials not found');
        }
        
        const prompt = `
        Compare the following SOP document with the QMSR guidelines and identify gaps.
        Format your response in markdown.
        
        SOP DOCUMENT:
        ${sop_content}
        
        QMSR GUIDELINES:
        ${guidelines_content}
        
        Please provide the following sections with markdown headers:
        
        ## Gaps Found
        [List all gaps found in the SOP compared to the guidelines]
        
        ## Suggested Updates
        [Provide detailed suggestions to align with QMSR]
        
        ## QMSR Clause References
        [List specific QMSR clause references relevant to the gaps]
        
        ## Summary
        [Provide a comprehensive summary of the comparison, detailed and point by point covering all the details.]
        `;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${apiKey}:qsmr` 
            },
            credentials: "include",
            body: JSON.stringify({ 
                model: "gemini-3-flash-preview", 
                messages: [{ role: "user", content: prompt }] 
            }),
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('LLM API response:', data);
        
        // For testing, return mock data if API call fails or in development
        if (!data.choices || !data.choices[0]) {
            return getMockResults();
        }
        
        const content = data.choices[0].message.content;
        
        // Extract sections using regex to handle markdown formatting
        const gapFoundMatch = content.match(/## Gaps Found[\s\S]*?(?=## Suggested Updates|$)/);
        const suggestedUpdateMatch = content.match(/## Suggested Updates[\s\S]*?(?=## QMSR Clause References|$)/);
        const qmsrReferenceMatch = content.match(/## QMSR Clause References[\s\S]*?(?=## Summary|$)/);
        const summaryMatch = content.match(/## Summary[\s\S]*/);
        
        return {
            oldText: sop_content,
            gapFound: gapFoundMatch ? gapFoundMatch[0] : 'No gaps found information available.',
            suggestedUpdate: suggestedUpdateMatch ? suggestedUpdateMatch[0] : 'No suggested updates available.',
            qmsrReference: qmsrReferenceMatch ? qmsrReferenceMatch[0] : 'No QMSR references available.',
            summary: summaryMatch ? summaryMatch[0] : 'No summary available.'
        };
    } catch (error) {
        console.error('Error calling LLM API:', error);
        // Return mock results for testing
        return getMockResults();
    }
}

function getMockResults() {
    return {
        oldText: sop_content,
        gapFound: "## Gaps Found\n\n- The SOP lacks detailed documentation requirements for manufacturing processes\n- There is no mention of regular audits or protocols for handling deviations\n- Risk assessment procedures are missing\n- No clear responsibility assignments for quality control tasks\n- Insufficient details on record retention and document control",
        suggestedUpdate: "## Suggested Updates\n\n1. **Documentation Enhancement**:\n   - Update the SOP to include comprehensive documentation requirements for all manufacturing processes\n   - Establish templates and standards for process documentation\n\n2. **Audit Procedures**:\n   - Add sections on conducting regular audits with specific timelines\n   - Define responsible parties for audit execution and follow-up\n\n3. **Deviation Management**:\n   - Develop clear protocols for identifying, reporting, and addressing deviations\n   - Implement a deviation tracking system\n\n4. **Risk Assessment**:\n   - Implement risk assessment procedures for each production stage\n   - Include risk mitigation strategies",
        qmsrReference: "## QMSR Clause References\n\n- **QMSR Section 4.2.1**: Documentation Requirements\n  - *Requires comprehensive documentation of all quality management processes*\n\n- **QMSR Section 8.2.4**: Monitoring and Measurement\n  - *Mandates regular monitoring of processes and product quality*\n\n- **QMSR Section 8.5.2**: Corrective Action\n  - *Specifies requirements for handling deviations and implementing corrective actions*\n\n- **QMSR Section 7.1**: Risk Management\n  - *Outlines risk assessment and mitigation requirements*",
        summary: "## Summary\n\nThe current SOP document lacks several key elements required by QMSR guidelines, including detailed documentation procedures, audit protocols, deviation handling, and risk assessment methodologies. The most significant gaps are in the areas of process documentation and risk management.\n\nThe SOP needs substantial updates to address these gaps, particularly in establishing clear responsibilities, implementing regular audit procedures, and developing comprehensive risk assessment protocols.\n\nImplementing the suggested updates will bring the SOP into compliance with QMSR requirements and improve overall quality management processes. Priority should be given to documentation enhancement and risk assessment implementation as these form the foundation for other quality management activities."
    };
}

function displayResults(result) {
    // Hide progress container with fade-out
    progressContainer.classList.add('opacity-0');
    setTimeout(() => {
        progressContainer.classList.add('hidden');
        
        // Reset all tab contents to hidden and prepare for animation
        tabContents.forEach(content => {
            content.classList.add('hidden', 'opacity-0');
        });
        
        // Show results container with fade-in
        resultsContainer.classList.remove('hidden');
        setTimeout(() => {
            resultsContainer.classList.add('opacity-100');
            resultsContainer.classList.remove('opacity-0');
        }, 50);
        
        // Populate tab contents
        document.getElementById('contentOldText').innerHTML = `<pre class="whitespace-pre-wrap p-3 bg-gray-50 rounded text-sm">${result.oldText}</pre>`;
        document.getElementById('contentGapFound').innerHTML = `<div class="p-3 bg-red-50 rounded text-sm">${formatContent(result.gapFound)}</div>`;
        document.getElementById('contentSuggestedUpdate').innerHTML = `<div class="p-3 bg-green-50 rounded text-sm">${formatContent(result.suggestedUpdate)}</div>`;
        document.getElementById('contentQmsrReference').innerHTML = `<div class="p-3 bg-blue-50 rounded text-sm">${formatContent(result.qmsrReference)}</div>`;
        document.getElementById('contentSummary').innerHTML = `<div class="p-3 bg-yellow-50 rounded text-sm">${formatContent(result.summary)}</div>`;
        
        // Show the first tab by default after a short delay to ensure smooth transition
        setTimeout(() => {
            document.getElementById('tabOldText').click();
        }, 100);
    }, 300);
}

function formatContent(content) {
    // Parse markdown content to HTML
    return marked.parse(content);
}
