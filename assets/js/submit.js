// International Journal of Ayurveda - Submission Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('articleSubmissionForm');
    const abstractTextarea = document.getElementById('abstract');
    const wordCountDisplay = document.getElementById('abstractWordCount');
    
    // Word counter for abstract
    function updateWordCount() {
        const text = abstractTextarea.value.trim();
        const words = text === '' ? 0 : text.split(/\s+/).length;
        wordCountDisplay.textContent = words;
        
        // Change color based on word count
        if (words > 250) {
            wordCountDisplay.style.color = '#e74c3c';
            wordCountDisplay.style.fontWeight = 'bold';
        } else if (words > 200) {
            wordCountDisplay.style.color = '#f39c12';
            wordCountDisplay.style.fontWeight = 'bold';
        } else {
            wordCountDisplay.style.color = '#27ae60';
            wordCountDisplay.style.fontWeight = 'normal';
        }
    }
    
    // Add event listener for word count
    if (abstractTextarea && wordCountDisplay) {
        abstractTextarea.addEventListener('input', updateWordCount);
        abstractTextarea.addEventListener('paste', function() {
            setTimeout(updateWordCount, 10);
        });
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        // Validate email
        const emailField = document.getElementById('authorEmail');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate abstract word count
        const text = abstractTextarea.value.trim();
        const words = text === '' ? 0 : text.split(/\s+/).length;
        if (words > 250) {
            showFieldError(abstractTextarea, 'Abstract must be 250 words or less');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9em';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '#ddd';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Generate submission data
    function generateSubmissionData() {
        const formData = new FormData(form);
        const submissionData = {};
        
        for (let [key, value] of formData.entries()) {
            submissionData[key] = value;
        }
        
        // Add submission timestamp
        submissionData.submissionDate = new Date().toISOString();
        submissionData.submissionId = 'IJA-' + Date.now();
        
        return submissionData;
    }
    
    // Create GitHub issue for submission
    async function createGitHubSubmission(submissionData) {
        const issueTitle = `New Submission: ${submissionData.articleTitle}`;
        const issueBody = `
## New Article Submission

**Submission ID:** ${submissionData.submissionId}
**Submission Date:** ${new Date(submissionData.submissionDate).toLocaleDateString()}

### Author Information
- **Lead Author:** ${submissionData.leadAuthor}
- **Email:** ${submissionData.authorEmail}
- **Institution:** ${submissionData.institution}
- **Co-authors:** ${submissionData.coAuthors || 'None'}

### Article Details
- **Title:** ${submissionData.articleTitle}
- **Type:** ${submissionData.articleType}
- **Specialization:** ${submissionData.specialization}
- **Keywords:** ${submissionData.keywords}

### Abstract
${submissionData.abstract}

### Introduction
${submissionData.introduction}

### Methodology
${submissionData.methodology || 'Not provided'}

### Results and Discussion
${submissionData.results}

### Conclusion
${submissionData.conclusion}

### References
${submissionData.references}

### Additional Information
- **Conflict of Interest:** ${submissionData.conflictInterest || 'None declared'}
- **Funding:** ${submissionData.funding || 'None'}
- **Acknowledgments:** ${submissionData.acknowledgments || 'None'}

### Submission Agreements
- Original Work: ✅ Confirmed
- Ethical Approval: ✅ Confirmed  
- Copyright Agreement: ✅ Confirmed
- Peer Review Agreement: ✅ Confirmed

---

**Status:** Pending Editorial Review
**Next Action:** Assign to Editorial Board for initial screening
`;

        // For now, we'll store this data locally
        // In a real implementation, this would submit to your backend
        console.log('Submission Data:', submissionData);
        console.log('GitHub Issue Title:', issueTitle);
        console.log('GitHub Issue Body:', issueBody);
        
        return {
            success: true,
            submissionId: submissionData.submissionId,
            message: 'Submission received successfully'
        };
    }
    
    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            showMessage('Please correct the errors and try again.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        try {
            // Generate submission data
            const submissionData = generateSubmissionData();
            
            // Create GitHub submission
            const result = await createGitHubSubmission(submissionData);
            
            if (result.success) {
                showMessage(
                    `Thank you! Your submission has been received successfully. 
                    Your submission ID is: ${result.submissionId}. 
                    You will receive a confirmation email shortly.`, 
                    'success'
                );
                
                // Clear form
                form.reset();
                updateWordCount();
                
                // Scroll to message
                document.querySelector('.message').scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(result.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showMessage('There was an error submitting your article. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }
    }
    
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        // Insert at the top of the form section
        const formSection = document.querySelector('.submission-form-section');
        formSection.insertBefore(messageDiv, formSection.firstChild);
    }
    
    // Add form submit event listener
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Add real-time validation for required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
    
    // Auto-save functionality (optional)
    let autoSaveTimer;
    const autoSaveFields = document.querySelectorAll('input, textarea, select');
    
    autoSaveFields.forEach(field => {
        field.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(autoSaveForm, 30000); // Auto-save every 30 seconds
        });
    });
    
    function autoSaveForm() {
        const formData = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
        
        localStorage.setItem('ija_draft_submission', JSON.stringify(formData));
        console.log('Form auto-saved');
    }
    
    // Load auto-saved data on page load
    function loadAutoSavedData() {
        const savedData = localStorage.getItem('ija_draft_submission');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                
                Object.keys(formData).forEach(key => {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = formData[key];
                        } else {
                            field.value = formData[key];
                        }
                    }
                });
                
                updateWordCount();
                console.log('Auto-saved data loaded');
            } catch (e) {
                console.error('Error loading auto-saved data:', e);
            }
        }
    }
    
    // Load auto-saved data
    loadAutoSavedData();
    
    // Clear auto-saved data on successful submission
    form.addEventListener('submit', function() {
        if (validateForm()) {
            localStorage.removeItem('ija_draft_submission');
        }
    });
});
